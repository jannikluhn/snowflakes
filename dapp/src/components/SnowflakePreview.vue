<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        Preview
      </p>
    </header>
    <div class="card-image">
      <SnowflakeCanvas size="20" v-bind:wasmWorker="wasmWorker" v-bind:tokenID="tokenID" v-bind:isMelted="isMelted" />
    </div>
    <div class="card-footer">
      <a :href="'#/snowflake/' + tokenIDHex" class="card-footer-item">Details</a>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import SnowflakeCanvas from './SnowflakeCanvas.vue'

export default {
  name: "SnowflakePreview",
  components: {
    SnowflakeCanvas,
  },
  props: [
    "wasmWorker",
    "tokenID",
    "isMelted",
  ],
  computed: {
    tokenIDHex() {
      let tokenIDHex = ethers.BigNumber.from(this.tokenID).toHexString()
      return ethers.utils.hexZeroPad(tokenIDHex, 32)
    },
  }
}
</script>