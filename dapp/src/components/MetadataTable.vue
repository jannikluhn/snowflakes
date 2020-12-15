<template>
  <section class="section">
    <h1 class="title">
      Metadata
    </h1>
    <table class="table">
      <tr>
      <th>Token ID</th>
      <td>{{ tokenIDHex }}</td>
      </tr>
      <tr>
      <th>Owner</th>
      <td>{{ owner }}</td>
      </tr>
      <tr>
      <th>Mint Date</th>
      <td>{{ mintingTimeFormatted }}</td>
      </tr>
      <tr>
      <th>Melt Date</th>
      <td>{{ meltingTimeFormatted }}</td>
      </tr>
    </table>
  </section>
</template>

<script>
import dateformat from 'dateformat'
import { ethers } from 'ethers'

export default {
  name: "MetadataTable",
  props: [
    "contract",
    "tokenID",
  ],
  data() {
    return {
      owner: null,
      mintingTime: null,
      meltingTime: null,
    }
  },
  computed: {
    mintingTimeFormatted() {
      let d = new Date(this.mintingTime * 1000)
      return dateformat(d)
    },
    meltingTimeFormatted() {
      let d = new Date(this.meltingTime * 1000)
      return dateformat(d)
    },
    tokenIDHex() {
      let tokenIDHex = ethers.BigNumber.from(this.tokenID).toHexString()
      return ethers.utils.hexZeroPad(tokenIDHex, 32)
    },
  },
  created() {
    this.update()
  },
  watch: {
    tokenID() {
      this.update()
    },
  },
  methods: {
    update() {
      this.contract.ownerOf(this.tokenID).then((owner) => {
        this.owner = owner
      }).catch(console.log)

      this.contract.mintingTime(this.tokenID).then((mintingTime) => {
        this.mintingTime = mintingTime.toNumber()
      }).catch(console.log)

      this.contract.meltingTime(this.tokenID).then((meltingTime) => {
        this.meltingTime = meltingTime.toNumber()
      }).catch(console.log)
    }
  },
}
</script>