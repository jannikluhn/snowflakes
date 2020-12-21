<template>
  <div>
    <WrongNetworkMessage
      v-if="!contracts"
      v-bind:provider="provider"
    />

    <section v-if="contracts && existenceChecked && !tokenExists" class="section">
      <article class="message is-danger">
        <div class="message-header">
          <p>Error</p>
        </div>
        <div class="message-body">
          <p>The snowflake with ID {{ tokenIDHex }} does not exist.</p>
        </div>
      </article>
    </section>

    <div v-if="contracts && existenceChecked && tokenExists">
      <section class="section">
        <h1 class="title">
          Snowflake
        </h1>
        <h2 class="subtitle">
          {{ tokenIDHex }}
        </h2>
        <div class="columns">
          <div class="column is-three-fifths is-offset-one-fifth">
            <SnowflakeCanvas v-bind:wasmWorker="wasmWorker" v-bind:tokenID="tokenID" v-bind:isMelted="isMelted" size="100" />
          </div>
        </div>
      </section>
      <MetadataTable
        v-bind:contracts="contracts"
        v-bind:tokenID="tokenID"
      />
      <TokenControls
        v-bind:provider="provider"
        v-bind:signer="signer"
        v-bind:contracts="contracts"
        v-bind:tokenID="tokenID"
      />
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import SnowflakeCanvas from './components/SnowflakeCanvas.vue'
import MetadataTable from './components/MetadataTable.vue'
import TokenControls from './components/TokenControls.vue'
import WrongNetworkMessage from './components/WrongNetworkMessage.vue'

export default {
  name: "Detail",
  props: [
    "wasmWorker",
    "provider",
    "signer",
    "contracts",
  ],
  components: {
    SnowflakeCanvas,
    MetadataTable,
    TokenControls,
    WrongNetworkMessage,
  },
  data() {
    return {
      existenceChecked: false,
      tokenExists: false,
      isMelted: false,
    }
  },
  computed: {
    tokenID() {
      return ethers.BigNumber.from(this.$route.params.id)
    },
    tokenIDHex() {
      let tokenIDHex = ethers.BigNumber.from(this.tokenID).toHexString()
      return ethers.utils.hexZeroPad(tokenIDHex, 32)
    },
  },
  created() {
    this.existenceChecked = false
    this.tokenExists = false
    this.checkExistence()
  },
  mounted() {
    this.window.addEventListener('unload', this.checkExistence)
  },
  beforeDestroyed() {
    this.window.removeEventListener('unload', this.checkExistence)
  },
  watch: {
    $route() {
      this.existenceChecked = false
      this.tokenExists = false
      this.checkExistence()
    },
    contracts() {
      this.existenceChecked = false
      this.tokenExists = false
      this.checkExistence()
    },
  },
  methods: {
    checkExistence() {
      if (this.tokenExists) {
        return
      }
      if (this.tokenID === null) {
        return
      }
      if (!this.contracts) {
        return
      }

      this.contracts.snowflake.exists(this.tokenID).then((exists) => {
        this.existenceChecked = true
        this.tokenExists = exists
        if (exists) {
          this.contracts.snowflake.isMelted(this.tokenID).then((isMelted) => {
            this.isMelted = isMelted
          })
        }
      })
    },
  },
}
</script>