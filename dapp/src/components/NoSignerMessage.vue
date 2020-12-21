<template>
  <article v-if="!signer" class="message is-primary">
    <div class="message-header">
      <p>No wallet connection</p>
    </div>
    <div class="message-body">
      <p>No signer detected. Please connect with Metamask and unlock an account.</p>
    </div>
  </article>
</template>

<script>
export default {
  name: "NoSignerMessage",
  props: [
    "signer",
  ],
}
</script>