<template>
  <div>
    <Latest v-bind:wasmWorker="wasmWorker" v-bind:contract="contract" />
    <Collection v-bind:wasmWorker="wasmWorker" v-bind:provider="provider" v-bind:contract="contract" />
  </div>
</template>

<script>
import Latest from './Latest.vue'
import Collection from './Collection.vue'

export default {
  name: "ContractComponents",
  components: {
    Latest,
    Collection,
  },    

  props: [
    "wasmWorker",
    "provider",
    "contract",
  ],
}
</script>