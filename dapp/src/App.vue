<template>
  <div id="app">
    <Title />
    <div class="container is-max-desktop">
      <router-view
        v-bind:wasmWorker="wasmWorker"
        v-bind:provider="provider"
        v-bind:signer="signer"
        v-bind:contracts="contracts"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import { ethers } from 'ethers'

import Title from './components/Title.vue'
import Footer from './components/Footer.vue'

import { infuraID, contractAddresses } from './config.js'
import SnowflakeMetadata from './assets/Snowflake.json'
import WaterMetadata from './assets/Water.json'

export default {
  name: "App",
  components: {
    Title,
    Footer,
  },

  data: function() {
    return {
      wasmWorker: null,
      provider: null,
      signer: null,
      contracts: null,
      network: null,
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
      this.window.ethereum.autoRefreshOnNetworkChange = false
      this.window.ethereum.on('chainChanged', this.onChainChanged)

      this.provider = new ethers.providers.Web3Provider(this.window.ethereum, "any")
      this.window.ethereum.request({method: "eth_requestAccounts"}).then(() => {
        this.signer = this.provider.getSigner()
      }).catch(() => {
        this.signer = null
      })
    } else {
      this.provider = new ethers.getDefaultProvider("homestead", {"infura": infuraID})
    }

    this.updateNetwork()
  },

  methods: {
    onChainChanged() {
      this.provider = new ethers.providers.Web3Provider(this.window.ethereum, "any")
      this.signer = this.provider.getSigner()
      this.contracts = null
      this.updateNetwork()
    },

    updateNetwork() {
      this.provider.getNetwork().then((network) => {
        this.network = network
        this.updateContracts()
      })
    },

    updateContracts() {
      if (!this.network) {
        this.contracts = null
        return
      }
      if (!(this.network.name in contractAddresses)) {
        this.contracts = null
        return
      }

      let addresses = contractAddresses[this.network.name]
      this.contracts = {
        snowflake: new ethers.Contract(addresses.snowflake, SnowflakeMetadata.abi, this.provider),
        water: new ethers.Contract(addresses.water, WaterMetadata.abi, this.provider),
      }
    }
  }
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
