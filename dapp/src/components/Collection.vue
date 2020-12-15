<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Your Snowflakes
      </h1>
      <div v-if="address" class="columns is-multiline">
        <div class="column is-one-quarter">
          <MintForm
            v-bind:provider="provider"
            v-bind:signer="signer"
            v-bind:contract="contractWithSigner"
            v-on:minted="onMinted"
          />
        </div>
        <div v-for="tokenID in tokenIDs" :key="tokenID.toString()" class="column is-one-quarter">
          <SnowflakePreview v-bind:wasmWorker="wasmWorker" v-bind:tokenID="tokenID" />
        </div>
      </div>
      <div v-if="signerChecked && !address">
        <NoSignerMessage />
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
    "contract",
  ],
  data() {
    return {
      "address": null,
      "tokenIDs": [],
      "contractWithSigner": null,
      "signerChecked": false,
    }
  },

  created() {
    if (!this.provider.getSigner) {
      this.signerChecked = true
      return
    }
    this.signer = this.provider.getSigner()
    this.contractWithSigner = this.contract.connect(this.signer)

    this.signer.getAddress().then((address) => {
      this.signerChecked = true
      this.address = address
      this.fetchTokens().catch(console.log)
    }).catch((error) => {
      console.log(error)
      this.signerChecked = true
      this.address = null
    })
  },

  methods: {
    async fetchTokens() {
      let n = await this.contract.balanceOf(this.address)
      for (let i = n - 1; i >= 0; i--) {
        let tokenID = await this.contract.tokenOfOwnerByIndex(this.address, i)
        let isMolten = await this.contract.isMolten(tokenID)
        if (isMolten) {
          continue
        }
        this.tokenIDs.push(tokenID)
      }
    },

    onMinted(tokenID) {
      this.tokenIDs.unshift(tokenID)
    },
  }
}
</script>

<style>
.card {
  height: 100%;
}
</style>