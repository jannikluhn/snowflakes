<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Latest Snowflakes
      </h1>
      <div v-if="tokenIDs.length" class="columns is-multiline">
        <div v-for="tokenID in tokenIDs" :key="tokenID.toString()" class="column is-one-quarter">
          <SnowflakePreview v-bind:wasmWorker="wasmWorker" v-bind:tokenID="tokenID" />
        </div>
      </div>
      <div v-else>
        <p>No snowflakes found</p>
      </div>
    </div>
  </section>
</template>

<script>
import SnowflakePreview from './SnowflakePreview.vue'

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export default {
  name: "Latest",
  components: {
    SnowflakePreview,
  },
  props: [
    "wasmWorker",
    "contract",
  ],
  data() {
    return {
      "tokenIDs": [],
      "maxTokens": 8,
    }
  },

  created() {
    this.fetchLatestTokens().then(() => {
      this.registerFilter().catch(console.log)
    }).catch(console.log)
  },

  methods: {
    async fetchLatestTokens() {
      let n = await this.contract.totalSupply()
      for (let i = n - 1; i >= 0 && this.tokenIDs.length < this.maxTokens; i--) {
        let tokenID = await this.contract.tokenByIndex(i)
        let isMolten = await this.contract.isMolten(tokenID)
        if (isMolten) {
          continue
        }
        this.tokenIDs.push(tokenID)
      }
    },

    async registerFilter() {
      let filter = this.contract.filters.Transfer(ZERO_ADDRESS, null, null)
      let first = true;
      this.contract.on(filter, (from, to, tokenID) => {
        if (first) {
          first = false
          return
        }
        this.tokenIDs.unshift(tokenID)
        while (this.tokenIDs.length > this.maxTokens) {
          this.tokenIDs.pop()
        }
      })
    }
  }
}
</script>