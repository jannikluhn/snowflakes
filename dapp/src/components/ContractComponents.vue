<template>
  <div>
    <Latest
      v-bind:wasmWorker="wasmWorker"
      v-bind:contracts="contracts"
    />
    <Collection
      v-bind:wasmWorker="wasmWorker"
      v-bind:provider="provider"
      v-bind:signer="signer"
      v-bind:contracts="contracts"
    />
    <MeltWater
      v-bind:signer="signer"
      v-bind:contracts="contracts"
    />
  </div>
</template>

<script>
import Latest from './Latest.vue'
import Collection from './Collection.vue'
import MeltWater from './MeltWater.vue'

export default {
  name: "ContractComponents",
  components: {
    Latest,
    Collection,
    MeltWater,
  },
  props: [
    "wasmWorker",
    "provider",
    "signer",
    "contracts",
  ],
}
</script>