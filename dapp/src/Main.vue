<template>
  <div>
    <Explanation />
    <WrongNetworkMessage
      v-if="!contracts"
      v-bind:provider="provider"
    />
    <ContractComponents
      v-if="contracts"
      v-bind:wasmWorker="wasmWorker"
      v-bind:provider="provider"
      v-bind:signer="signer"
      v-bind:contracts="contracts"
    />
  </div>
</template>

<script>
import Explanation from './components/Explanation.vue'
import ContractComponents from './components/ContractComponents.vue'
import WrongNetworkMessage from './components/WrongNetworkMessage.vue'

export default {
  name: 'Main',
  components: {
    Explanation,
    ContractComponents,
    WrongNetworkMessage,
  },
  props: [
    "wasmWorker",
    "provider",
    "signer",
    "contracts",
  ],
}
</script>