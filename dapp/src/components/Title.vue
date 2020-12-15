<template>
  <section class="hero is-primary is-bold">
    <div class="hero-body">
      <div class="container is-max-desktop">
        <div class="level">
          <div class="level-left">
            <router-link to="/">
              <h1 class="title">
                Snowflake NFTs
              </h1>
              <h2 class="subtitle">
                Winter on Ethereum
              </h2>
            </router-link>
          </div>
          <div class="level-right">
            <router-link to="/">
              <figure class="image title-image">
                <img src="../assets/snowflake.png">
              </figure>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Title'
}
</script>

<style>
.title-image {
  max-width: 300px;
}
</style>