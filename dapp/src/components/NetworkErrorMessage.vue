<template>
  <section class="section">
    <article class="message is-danger">
      <div class="message-header">
        <p>Error</p>
      </div>
      <div class="message-body">
        <p>Your wallet is currently connected to {{network}}. Please connect to {{config.network}} to view and mint snowflakes.</p>
      </div>
    </article>
  </section>
</template>

<script>
import config from '../config.js'

export default {
  name: "NetworkErrorMessage",
  props: [
    "network",
  ],
  data() {
    return {
      config: config,
    }
  },
}
</script>