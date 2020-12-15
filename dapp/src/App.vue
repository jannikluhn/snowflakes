<template>
  <div id="app">
    <Title />
    <div class="container is-max-desktop">
      <router-view v-bind:wasmWorker="wasmWorker" v-bind:provider="provider" v-bind:contract="contract" v-bind:network="network" />
    </div>
    <footer class="footer">
      <div class="container content has-text-right is-max-desktop">
        <span class="icon is-large">
          <a href="https://github.com/jannikluhn/snowflakes">
            <i class="fab fa-3x fa-github"></i>
          </a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import Title from './components/Title.vue'

import config from './config.js'
import contractMetadata from './assets/Snowflake.json'

export default {
  name: "App",
  components: {
    Title,
  },

  data: function() {
    return {
      wasmWorker: null,
      provider: null,
      contract: null,
      network: null,
      config: config,
    }
  },

  created() {
    var worker = new Worker('wasm_worker.js')  
    worker.addEventListener('message', () => {
      this.wasmWorker = worker
    }, {
      once: true,
    })

    if (this.window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(this.window.ethereum)
      this.window.ethereum.enable()
    } else {
      this.provider = new ethers.getDefaultProvider("goerli", {"infura": config.infuraID})
    }
    this.contract = new ethers.Contract(config.contractAddress, contractMetadata.abi, this.provider)

    this.provider.getNetwork().then((network) => {
      this.network = network.name
    })
  },
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/initial-variables"

// Set your colors
$scheme-main: $black-ter
$scheme-invert: $white-ter
$text: $grey-light
$text-strong: $grey-light

$primary: hsl(216, 46, 32)
$primary-light: hsl(216, 46, 70)
$border-light: $grey-darker
$title-color: $primary-light
$link: $primary-light
$table-cell-border: 0px
$input-border-color: $primary
$input-hover-color: $primary-light
$modal-background-background-color: $grey-darker
$modal-card-head-background-color: $primary
$footer-background-color: $primary
$footer-padding: 1rem

// Import Bulma and Buefy styles
@import "~bulma"
@import "~buefy/src/scss/buefy"
</style>
