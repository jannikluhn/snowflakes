<template>
  <figure v-if="!isMelted" class="image is-1by1 m-3">
    <canvas ref="canvas" class="has-ratio">
        Your browser does not support WebGL which is required to render snowflakes.
    </canvas>
  </figure>
  <figure v-else class="image is-1by1 m-3">
    <img src="../assets/drop.png">
  </figure>
</template>

<script>
import { SnowflakeRenderer } from '../snowflake_renderer'

export default {
  name: "SnowflakeCanvas",
  props: [
    "wasmWorker",
    "tokenID",
    "isMelted",
    "size",
  ],
  data: function() {
    return {
      renderer: null,
      renderingStarted: false,
    }
  },

  mounted() {
    if (!this.isMelted) {
      this.$refs.canvas.height = this.$refs.canvas.clientHeight
      this.renderer = new SnowflakeRenderer(this.$refs.canvas)
      this.renderer.init()
      this.maybeStartRendering()
      this.$refs.canvas.width = this.$refs.canvas.clientWidth
    }
  },

  watch: {
    wasmWorker() {
      this.maybeStartRendering()
    },
    tokenID() {
      this.maybeStartRendering()
    },
  },

  methods: {
    maybeStartRendering() {
      if (this.renderingStarted) {
        return
      }
      if (!this.wasmWorker) {
        return
      }
      if (!this.tokenID) {
        return
      }
      if (this.isMelted) {
        return
      }
      this.renderingStarted = true
      this.wasmWorker.addEventListener('message', this.handleWASMMessage)
      this.wasmWorker.postMessage({
        method: "addSnowflake",
        seed: this.tokenID.toString(),
        size: this.size,
      })
    },

    handleWASMMessage(e) {
      if (e.data["seed"] != this.tokenID.toString() || e.data["size"] != this.size) {
        return
      }
      this.renderer.fillBuffer(e.data["cells"], e.data["maxCellValue"], e.data["size"])
      this.renderer.draw()
    }
  }
}
</script>