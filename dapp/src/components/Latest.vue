<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Latest Snowflakes
      </h1>
      <div v-if="numTokens > 0">
        <div class="columns is-multiline">
          <div v-for="snowflake in snowflakes" :key="snowflake.tokenID.toString()" class="column is-one-quarter">
            <SnowflakePreview
              v-bind:wasmWorker="wasmWorker"
              v-bind:tokenID="snowflake.tokenID"
              v-bind:isMelted="snowflake.isMelted"
            />
          </div>
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

export default {
  name: "Latest",
  components: {
    SnowflakePreview,
  },
  props: [
    "wasmWorker",
    "contracts",
  ],
  data() {
    return {
      snowflakes: [],
      tokensPerPage: 8,
      numTokens: 0,
    }
  },

  watch: {
    contracts: {
      immediate: true,
      handler() {
        this.numTokens = 0

        if (this.contracts) {
          this.contracts.snowflake.totalSupply().then((n) => {
            this.numTokens = n
            this.fetchLatestTokens()
          })
        }
      },
    }
  },

  methods: {
    async fetchLatestTokens() {
      let snowflakeContract = this.contracts.snowflake

      let snowflakes = []
      this.snowflakes = snowflakes

      let n = await snowflakeContract.totalSupply()

      for (let i = n - 1; i >= 0 && this.snowflakes.length < this.tokensPerPage; i--) {
        if (this.snowflakes !== snowflakes) {
          break
        }
        let tokenID = await snowflakeContract.tokenByIndex(i)
        let isMelted = await snowflakeContract.isMelted(tokenID)
        snowflakes.push({
          tokenID: tokenID,
          isMelted: isMelted,
        })
      }
    },
  }
}
</script>