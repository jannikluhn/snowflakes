<template>
  <section class="section">
    <div class="container">
    <h1 class="title has-text-centered">Snowflakes are ...</h1>
      <div class="tile is-ancestor">
        <div class="tile is-vertical">
          <ExplanationTile
            title="Unique"
            text="No two snowflakes are alike. Each one is seeded with a random number, giving rise to its (usually) unique shape."
          />
          <ExplanationTile
            title="Free"
            text="In nature, snowflakes simply fall from the sky. As NFTs, they can be minted, transferred, and burned without charge or permission."
          />
          <ExplanationTile
            title="Abundant"
            text="Different from most tokens, snowflakes are not scarce and their number is unlimited. Therefore, you can own as many snowflakes as you wish."
          />
        </div>
        <div class="tile is-vertical">
          <ExplanationTile
            title="Ephemeral"
            text="Life is short, especially for snowflakes. They will melt and turn into water after a few weeks' time."
          />
          <ExplanationTile
            title="Complex"
            text="Snowflakes often exhibit delicate details and rendering them in high resolution may take some time."
          />
          <ExplanationTile
            title="Cold"
            text="When spring begins, the time of snowflakes is over. No more snowflakes can be generated and existing ones will melt."
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ExplanationTile from './ExplanationTile.vue'

export default {
  name: 'Explanation',
  components: {
    ExplanationTile
  },
}
</script>