<template>
  <v-ons-page id="viewStreamPage">
    <base-video ref="videoplayer" :options="videoOptions">
      <template v-slot:top>
        <div class="stream__controls stream__controls--top">
          <v-ons-button
            class="btn btn--small btn--opacity-soft   flex-center-xy"
          >
            <base-icon class="btn__icon" name="user"></base-icon>
            <span class="ml-2">101</span>
          </v-ons-button>
          <div class="ml-auto flex">
            <v-ons-button
              @click="reportConfirm = true"
              class="btn btn--square  btn--opacity-soft btn--small "
            >
              <base-icon class="btn__icon" name="flag"></base-icon>
            </v-ons-button>
            <div class="flex-column ml-2">
              <v-ons-button
                @click="endViewingVideo"
                class="btn btn--small btn--opacity-soft btn--square mb-2"
              >
                <base-icon class="btn__icon" name="times"></base-icon>
              </v-ons-button>
              <v-ons-button
                @click="dropVideoMenu"
                class="btn btn--small  btn--opacity-soft btn--square mb-2"
              >
                <base-icon class="btn__icon" name="menu-dots"></base-icon>
              </v-ons-button>
              <transition name="vide-menu">
                <div
                  v-show="isVideoMenuDropped"
                  class="video__controls__menu flex-column"
                >
                  <v-ons-button
                    class="btn btn--square  btn--opacity-soft btn--small  mb-2"
                  >
                    <base-icon
                      class="btn__icon"
                      name="shopping-cart"
                    ></base-icon>
                  </v-ons-button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:bottom>
        <div
          style="bottom:2.2rem"
          class="stream__controls stream__controls--bottom"
        >
          <div class="flex-column stream-detail">
            <h5 class="stream-detail__title">
              details
            </h5>
            <p class="stream-detail__hashtag">
              hashtags
            </p>
          </div>

          <div class=" ml-auto flex-column ">
            <a @click.prevent="tipStreamer()" class="btn-tip mb-2">
              <img src="@/assets/img/thundercore-logo.svg" />
            </a>
          </div>
        </div>
      </template>
    </base-video>
  </v-ons-page>
</template>
<script>
import BaseVideo from "@/components/BaseVideo.vue";
import Web3 from "web3";
import { address, ABI } from "@/util/constants/tippingContract";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("requests");
import devLog from "@/util/devlog.js";
export default {
  name: "ViewVideo",
  components: {
    BaseVideo
  },
  data() {
    return {
      player: null,
      videoOptions: {
        controls: [
          "play-large",
          "progress",
          "current-time",
          "mute",
          "settings"
        ],
        settings: ["speed", "loop"]
      },
      isVideoMenuDropped: false
    };
  },
  methods: {
    ...mapGetters(["getSelectedPin", "myWalletAddress"]),
    endViewingVideo() {
      this.$router.push({ path: "/" });
    },
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
    },
    async tipStreamer() {
      let amount = 1;

      var web3Instance = new Web3(window.web3.currentProvider);

      devLog(web3Instance);

      let tippingContract = await window.web3.eth.contract(ABI);
      let tippingContractInstance = await tippingContract.at(address);

      devLog(tippingContract);
      devLog(tippingContractInstance);

      await tippingContractInstance.tip(
        this._getStreamerWalletAddress(),
        {
          gas: 300000,
          gasPrice: "0x14f46b0400",
          value: window.web3.toWei(String(amount), "ether"),
          from: this.$store.state.web3.coinbase
        },
        err => {
          if (err) {
            devLog(err);
          } else {
            // let TipEvent = tippingContractInstance.Tip()
            // TipEvent.watch((err, result) => {
            //     if (err) {
            //         devLog('could not get event Won()')
            //     } else {
            //         devLog(result)
            //         //Show notification that tip has been sent.
            //     }
            // })
          }
        }
      );
    }
  },
  // beforeRouteEnter(next) {
  //   debugger;
  //   next();
  // },
  // beforeRouteUpdate() {
  //   debugger;
  // },
  async mounted() {
    this.player = this.$refs.videoplayer.$refs.video;

    console.log(this.player);
  }
};
</script>
<style lang="scss">
.vide-menu-enter-active,
.vide-menu-leave-active {
  transition: all 0.5s;
}
.vide-menu-enter,
.vide-menu-leave-to {
  transform: translateX(1rem);
  opacity: 0;
}
* {
  transition: all;
}
.vide-menu-move {
  transition: all 0.5s;
}
</style>
