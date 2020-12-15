<template>
  <div>
    <Explanation />
    <NetworkErrorMessage v-if="!correctNetwork" v-bind:network="network" />
    <ContractComponents v-else v-bind:wasmWorker="wasmWorker" v-bind:provider="provider" v-bind:contract="contract" />
  </div>
</template>

<script>
import config from './config.js'

import Explanation from './components/Explanation.vue'
import ContractComponents from './components/ContractComponents.vue'
import NetworkErrorMessage from './components/NetworkErrorMessage.vue'

export default {
  name: 'Main',
  components: {
    Explanation,
    ContractComponents,
    NetworkErrorMessage,
  },
  props: [
    "wasmWorker",
    "provider",
    "contract",
    "network",
  ],
  computed: {
    correctNetwork() {
      return this.network == config.network
    }
  },
}
</script>