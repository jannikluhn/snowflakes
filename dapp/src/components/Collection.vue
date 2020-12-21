<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Your Snowflakes
      </h1>
      <NoSignerMessage v-bind:signer="signer" />
      <div v-if="signer" class="columns is-multiline">
        <div class="column is-one-quarter">
          <MintForm
            v-bind:provider="provider"
            v-bind:signer="signer"
            v-bind:contracts="contracts"
            v-on:minted="onMinted"
          />
        </div>
        <div v-for="snowflake in snowflakes" :key="snowflake.tokenID.toString()" class="column is-one-quarter">
          <SnowflakePreview v-bind:wasmWorker="wasmWorker" v-bind:tokenID="snowflake.tokenID" v-bind:isMelted="snowflake.isMelted" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SnowflakePreview from './SnowflakePreview.vue'
import MintForm from './MintForm.vue'
import NoSignerMessage from './NoSignerMessage.vue'

export default {
  name: "Collection",
  components: {
    SnowflakePreview,
    MintForm,
    NoSignerMessage,
  },
  props: [
    "wasmWorker",
    "provider",
    "signer",
    "contracts",
  ],
  data() {
    return {
      "address": null,
      "snowflakes": [],
    }
  },
  watch: {
    signer: {
      immediate: true,
      handler() {
        this.fetchTokens()
      },
    },
  },

  methods: {
    async fetchTokens() {
      let snowflakes = []
      this.snowflakes = snowflakes

      if (!this.signer) {
        return
      }

      let snowflakeContract = this.contracts.snowflake
      let address = await this.signer.getAddress()
      let n = await snowflakeContract.balanceOf(address)
      for (let i = n - 1; i >= 0; i--) {
        if (this.snowflakes !== snowflakes) {
          break
        }

        let tokenID = await snowflakeContract.tokenOfOwnerByIndex(address, i)
        let isMelted = await snowflakeContract.isMelted(tokenID)
        let snowflake = {
          tokenID: tokenID,
          isMelted: isMelted,
        }
        snowflakes.push(snowflake)
      }
    },

    onMinted(tokenID) {
      this.snowflakes.unshift({
        tokenID: tokenID,
        isMelted: false,
      })
    },
  }
}
</script>

<style>
.card {
  height: 100%;
}
</style>