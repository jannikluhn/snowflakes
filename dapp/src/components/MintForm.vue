<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        New Snowflake
      </p>
    </header>
    <div class="card-body">
      <div class="container mt-6 mb-5 has-text-centered">
        <button
          class="button is-primary is-large"
          v-on:click=mint()
          v-bind:class="{ 'is-loading': waitingForTx }"
        >
          Mint
        </button>
      </div>
        <p class="has-text-centered mb-5 mx-1">
          Press the button to mint your own snowflake.
        </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MintForm",
  props: [
    "provider",
    "signer",
    "contract",
  ],
  data() {
    return {
      waitingForTx: false,
    }
  },

  methods: {
    mint() {
      this.waitingForTx = true
      this.contract.mint().then((tx) => {
        this.provider.waitForTransaction(tx.hash).then((receipt) => {
          this.waitingForTx = false
          let log = receipt.logs[0]
          let event = this.contract.interface.parseLog(log)
          let mintedTokenID = event.args.tokenId
          this.$emit("minted", mintedTokenID)
        }).catch((reason) => {
          console.log("tx failed", reason)
          this.waitingForTx = false
        })
      }).catch((reason) => {
        console.log("failed to send tx", reason)
        this.waitingForTx = false
      })
    },
  }
}
</script>