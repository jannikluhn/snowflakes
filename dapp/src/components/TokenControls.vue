<template>
  <section class="section">
    <h1 class="title">
      Ownership
    </h1>
    <NoSignerMessage v-if="signerChecked && noSigner" />
    <p v-if="!noSigner && address != owner">The connected account is not the owner of this snowflake and is not allowed to transfer or burn it.</p>
    <div v-if="!noSigner && address == owner">
      <div class="field is-grouped">
        <div class="field has-addons is-expanded">
            <div class="control is-expanded">
              <input class="input" v-bind:class="{ 'is-danger': !isValidReceiver }" type="text" placeholder="Receiver" v-model="receiverAddressHex">
              <p v-if="!isValidReceiver" class="help is-danger">This address is invalid</p>
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
  </section>
</template>

<script>
import NoSignerMessage from './NoSignerMessage.vue'
import { ethers } from 'ethers'

export default {
  name: "TokenControls",
  props: [
    "provider",
    "contract",
    "tokenID",
  ],
  components: {
    NoSignerMessage,
  },
  data() {
    return {
      "signerChecked": false,
      "noSigner": false,
      "contractWithSigner": null,
      "address": null,
      "owner": null,
      "showBurnConfirmation": false,
      "waitingForBurnTx": false,
      "receiverAddressHex": "",
      "showTransferConfirmation": false,
      "waitingForTransferTx": false,
    }
  },
  created() {
    this.initSigner()
    this.checkOwner()
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
  methods: {
    initSigner() {
      if (!this.provider.getSigner) {
        return
      }
      this.signer = this.provider.getSigner()
      this.contractWithSigner = this.contract.connect(this.signer)

      this.signer.getAddress().then((address) => {
        this.signerChecked = true
        this.noSigner = false
        this.address = address
      }).catch((error) => {
        this.signerChecked = true
        this.noSigner = true
        this.address = null
        console.log(error)
      })
    },
    checkOwner() {
      this.contract.ownerOf(this.tokenID).then((owner) => {
        this.owner = owner
      }).catch(console.log)
    },

    burn() {
      this.waitingForBurnTx = true
      this.contractWithSigner.burn(this.tokenID).then((tx) => {
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
      this.waitingForTransferTx = true
      this.contractWithSigner.transferFrom(this.owner, this.receiverAddressHex, this.tokenID).then((tx) => {
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