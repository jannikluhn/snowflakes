<template>
  <div>
    <NetworkErrorMessage v-if="!correctNetwork" v-bind:network="network" />
    <section v-if="correctNetwork && existenceChecked && !tokenExists" class="section">
      <article class="message is-danger">
        <div class="message-header">
          <p>Error</p>
        </div>
        <div class="message-body">
          <p>The snowflake with ID {{ tokenIDHex }} does not exist. If you just minted it, try to refresh the page in a few seconds.</p>
        </div>
      </article>
    </section>
    <div v-if="correctNetwork && existenceChecked && tokenExists">
      <section class="section">
        <h1 class="title">
          Snowflake
        </h1>
        <h2 class="subtitle">
          {{ tokenIDHex }}
        </h2>
        <div class="columns">
          <div class="column is-three-fifths is-offset-one-fifth">
            <SnowflakeCanvas v-bind:wasmWorker="wasmWorker" v-bind:tokenID="tokenID" size="100" />
          </div>
        </div>
      </section>
      <MetadataTable v-bind:contract="contract" v-bind:tokenID="tokenID" />
      <TokenControls v-bind:provider="provider" v-bind:contract="contract" v-bind:tokenID="tokenID" />
    </div>
  </div>
</template>

<script>
import config from './config.js'
import { ethers } from 'ethers'

import SnowflakeCanvas from './components/SnowflakeCanvas.vue'
import MetadataTable from './components/MetadataTable.vue'
import TokenControls from './components/TokenControls.vue'
import NetworkErrorMessage from './components/NetworkErrorMessage.vue'

export default {
  name: "Detail",
  props: [
    "wasmWorker",
    "provider",
    "contract",
    "network",
  ],
  components: {
    SnowflakeCanvas,
    MetadataTable,
    TokenControls,
    NetworkErrorMessage,
  },
  data() {
    return {
      existenceChecked: false,
      tokenExists: false,
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
    correctNetwork() {
      return this.network == config.network
    },
  },
  created() {
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
    }
  },
  methods: {
    checkExistence() {
      if (this.tokenExists) {
        return
      }
      if (this.tokenID === null) {
        return
      }
      this.contract.exists(this.tokenID).then((exists) => {
        if (!exists) {
          this.existenceChecked = true
          this.tokenExists = false
        } else {
          this.contract.isMolten(this.tokenID).then((isMolten) => {
            this.existenceChecked = true
            if (isMolten) {
              this.tokenExists = false
            } else {
              this.tokenExists = true
            }
          })
        }
      }).catch(console.log)
    },
  },
}
</script>