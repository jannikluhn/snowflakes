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
      <td>{{ mintTimeFormatted }}</td>
      </tr>
      <tr>
      <th>Melt Date</th>
      <td>{{ meltTimeFormatted }}</td>
      </tr>
      <tr>
      <th>Melted</th>
      <td>{{ isMelted ? "Yes" : "No" }}</td>
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
    "contracts",
    "tokenID",
  ],
  data() {
    return {
      owner: null,
      mintTime: null,
      meltTime: null,
      isMelted: null,
    }
  },
  computed: {
    mintTimeFormatted() {
      let d = new Date(this.mintTime * 1000)
      return dateformat(d)
    },
    meltTimeFormatted() {
      let d = new Date(this.meltTime * 1000)
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
    contracts() {
      this.update()
    },
  },
  methods: {
    update() {
      this.contracts.snowflake.ownerOf(this.tokenID).then((owner) => {
        this.owner = owner
      })

      this.contracts.snowflake.mintTime(this.tokenID).then((mintTime) => {
        this.mintTime = mintTime.toNumber()
      })

      this.contracts.snowflake.getMeltTime(this.tokenID).then((meltTime) => {
        this.meltTime = meltTime.toNumber()
      })

      this.contracts.snowflake.isMelted(this.tokenID).then((isMelted) => {
        this.isMelted = isMelted
      })
    }
  },
}
</script>