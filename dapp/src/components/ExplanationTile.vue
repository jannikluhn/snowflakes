<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-primary">
      <h1 class="title has-text-centered is-spaced">{{ title }}</h1>
      <h2 class="subtitle">{{ text }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExplanationTile',
  props: ['title', 'text'],
}
</script>