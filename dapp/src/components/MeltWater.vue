<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Melt Water
      </h1>
      <NoSignerMessage v-bind:signer="signer" />
      <article v-if="signer">
        <p>You own {{ balanceEth }} water tokens.</p>
      </article>
    </div>
  </section>
</template>

<script>
import { ethers } from 'ethers'

import NoSignerMessage from './NoSignerMessage.vue'

export default {
  name: "MeltWater",
  props: [
    "signer",
    "contracts",
  ],
  components: {
    NoSignerMessage,
  },
  data() {
    return {
      balance: ethers.constants.Zero,
    }
  },
  watch: {
    signer: {
      immediate: true,
      handler() {
        this.check()
      },
    },
    contracts: {
      immediate: true,
      handler() {
        this.check()
      },
    }
  },
  computed: {
    balanceEth() {
      return this.balance.div(ethers.constants.WeiPerEther)
    },
  },
  methods: {
    check() {
      if (!this.signer) {
        this.balance = 0
        return
      }
      if (!this.contracts) {
        this.balance = 0
        return
      }
      this.signer.getAddress().then((address) => {
        let contract = this.contracts.water.connect(this.signer)
        contract.balanceOf(address).then((balance) => {
          this.balance = balance
        }).catch((err) => {
          console.log(err)
          this.balance = 0
        })
      }).catch((err) => {
        console.log(err)
        this.balance = 0
      })
    }
  }
}
</script>