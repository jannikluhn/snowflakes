<template>
  <section v-if="unknownNetwork" class="section">
    <article class="message is-danger">
      <div class="message-header">
        <p>Error</p>
      </div>
      <div class="message-body">
        <p>Your wallet is currently connected to {{network}}. Please connect to mainnet or goerli to continue.</p>
      </div>
    </article>
  </section>
</template>

<script>
import { contractAddresses } from '../config.js'

export default {
  name: "WrongNetworkMessage",
  props: [
    "provider",
  ],
  data() {
    return {
      network: null,
      unknownNetwork: false,
    }
  },
  watch: {
    provider: {
      immediate: true,
      handler() {
        this.checkNetwork()
      },
    },
  },

  methods: {
    checkNetwork() {
      this.provider.getNetwork().then((network) => {
        this.network = network.name
        this.unknownNetwork = !(network.name in contractAddresses)
      })
    },
  }
}
</script>