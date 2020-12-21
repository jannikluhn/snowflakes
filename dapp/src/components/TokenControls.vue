<template>
  <section class="section">
    <h1 class="title">
      Ownership
    </h1>

    <NoSignerMessage v-if="!signer" v-bind:signer="signer" />

    <p v-if="signer && address != owner">The connected account is not the owner of this snowflake and is not allowed to transfer or burn it.</p>
    
    <div v-if="signer && address == owner">
      <div v-if="!isMelted" class="field is-grouped">
        <div class="field has-addons is-expanded">
            <div class="control is-expanded">
              <input class="input" v-bind:class="{ 'is-danger': receiverAddressHex && !isValidReceiver }" type="text" placeholder="Receiver" v-model="receiverAddressHex">
              <p v-if="receiverAddressHex && !isValidReceiver" class="help is-danger">This address is invalid</p>
            </div>
          <div class="control">
            <button class="button is-primary" v-bind:disabled="!isValidReceiver" v-on:click="showTransferConfirmation = true">Transfer</button>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-danger" v-on:click="showBurnConfirmation = true">Burn</button>
          </div>
        </div>
      </div>

      <div v-if="isMelted" class="field">
        <div class="control has-text-centered">
          <button class="button is-primary" v-on:click="showClaimConfirmation = true">Claim Melt Water</button>
        </div>
      </div>
    </div>

    <div v-if="showBurnConfirmation" class="modal" v-bind:class="{ 'is-active': showBurnConfirmation }">
      <div class="modal-background"></div>
      <div class="modal-card is-danger">
        <header class="modal-card-head">
          <p class="modal-card-title">Are you sure you want to burn the snowflake?</p>
          <button class="delete" aria-label="close" v-on:click="showBurnConfirmation = false"></button>
        </header>
        <section class="modal-card-body">
          <form class="field is-grouped">
            <div class="field">
              <div class="control">
                  <button class="button is-primary" v-on:click="showBurnConfirmation = false">No, keep it</button>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-danger" v-bind:class="{ 'is-loading': waitingForBurnTx }" v-on:click="burn()">Yes, burn it</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>

    <div v-if="showTransferConfirmation" class="modal" v-bind:class="{ 'is-active': showTransferConfirmation }">
      <div class="modal-background"></div>
      <div class="modal-card is-danger">
        <header class="modal-card-head">
          <p class="modal-card-title">Are you sure you want to transfer the snowflake?</p>
          <button class="delete" aria-label="close" v-on:click="showTransferConfirmation = false"></button>
        </header>
        <section class="modal-card-body">
          <form class="field is-grouped">
            <div class="field">
              <div class="control">
                  <button class="button is-primary" v-on:click="showTransferConfirmation = false">No, keep it</button>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-danger" v-bind:class="{ 'is-loading': waitingForTransferTx }" v-on:click="transfer()">Yes, transfer it</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>

    <div v-if="showClaimConfirmation" class="modal" v-bind:class="{ 'is-active': showClaimConfirmation }">
      <div class="modal-background"></div>
      <div class="modal-card is-danger">
        <header class="modal-card-head">
          <p class="modal-card-title">Are you sure you want to claim the melt water?</p>
          <button class="delete" aria-label="close" v-on:click="showClaimConfirmation = false"></button>
        </header>
        <section class="modal-card-body">
          <form class="field is-grouped">
            <div class="field">
              <div class="control">
                  <button class="button is-primary" v-on:click="showClaimConfirmation = false">No, not yet</button>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-danger" v-bind:class="{ 'is-loading': waitingForBurnTx }" v-on:click="burn()">Yes, claim it</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import NoSignerMessage from './NoSignerMessage.vue'
import { ethers } from 'ethers'

export default {
  name: "TokenControls",
  props: [
    "provider",
    "signer",
    "contracts",
    "tokenID",
  ],
  components: {
    NoSignerMessage,
  },
  data() {
    return {
      "address": null,
      "owner": null,
      "isMelted": null,
      "showBurnConfirmation": false,
      "waitingForBurnTx": false,
      "receiverAddressHex": "",
      "showTransferConfirmation": false,
      "waitingForTransferTx": false,
      "showClaimConfirmation": false,
    }
  },
  computed: {
    isValidReceiver() {
      try {
        ethers.utils.getAddress(this.receiverAddressHex)
      } catch {
        return false
      }
      return true
    },
  },
  watch: {
    signer: {
      immediate: true,
      handler() {
        if (!this.signer) {
          this.address = null
        } else {
          this.signer.getAddress().then((address) => {
            this.address = address
          }).catch(() => {
            this.address = null
          })
        }
      },
    },
    contracts: {
      immediate: true,
      handler() {
        this.contracts.snowflake.ownerOf(this.tokenID).then((owner) => {
          this.owner = owner
        })
        this.contracts.snowflake.isMelted(this.tokenID).then((isMelted) => {
          this.isMelted = isMelted
        })
      },
    },
  },
  methods: {
    burn() {
      let contract = this.contracts.snowflake.connect(this.signer)

      this.waitingForBurnTx = true
      contract.burn(this.tokenID).then((tx) => {
        this.provider.waitForTransaction(tx.hash).then(() => {
          this.waitingForBurnTx = false
          this.showBurnConfirmation = false
          this.$router.go()
        }).catch((reason) => {
          console.log("tx failed", reason)
          this.waitingForBurnTx = false
          this.showBurnConfirmation = false
        })
      }).catch((reason) => {
        console.log("failed to send tx", reason)
        this.waitingForBurnTx = false
        this.showBurnConfirmation = false
      })
    },

    transfer() {
      let contract = this.contracts.snowflake.connect(this.signer)

      this.waitingForTransferTx = true
      contract.transferFrom(this.owner, this.receiverAddressHex, this.tokenID).then((tx) => {
        this.provider.waitForTransaction(tx.hash).then(() => {
          this.waitingForTransferTx = false
          this.showTransferConfirmation = false
          this.$router.go()
        }).catch((reason) => {
          console.log("tx failed", reason)
          this.waitingForTransferTx = false
          this.showTransferConfirmation = false
        })
      }).catch((reason) => {
        console.log("failed to send tx", reason)
        this.waitingForTransferTx = false
        this.showTransferConfirmation = false
      })
    },
  },
}
</script>