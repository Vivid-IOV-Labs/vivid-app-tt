<template>
  <v-ons-page id="viewStreamPage">
    <base-video ref="videoplayer" :options="videoOptions">
      <template v-slot:top>
        <div class="stream__controls stream__controls--top">
          <div class="flex">
            <v-ons-button
              class="btn btn--small btn--opacity-soft flex-center-xy"
            >
              <base-icon class="btn__icon" name="user"></base-icon>
              <span class="ml-2">101</span>
            </v-ons-button>
            <v-ons-button
              class="btn btn--small btn--opacity-soft flex-center-xy ml-2"
            >
              <base-icon class="btn__icon" name="thundercore"></base-icon>
              <span class="ml-2">101</span>
            </v-ons-button>
          </div>

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
            <div ref="tipbutton">
              <a @click.prevent="tipStreamer" class="btn-tip mb-2">
                <img src="@/assets/img/thundercore-logo.svg" />
              </a>
            </div>
          </div>
        </div>
      </template>
    </base-video>
    <v-ons-popover :visible.sync="isPopoverVisible" :target="popoverTarget">
      <p class="bold text-center">Click here to tip 1TT</p>
    </v-ons-popover>
  </v-ons-page>
</template>
<script>
import BaseVideo from "@/components/BaseVideo.vue";
// import Web3 from "web3";
// import {
//   address as smartContractAddress,
//   ABI as smartContractABI
// } from "@/util/constants/tippingContract";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("requests");
import { trackEvent } from "@/util/analytics";
import delay from "@/util/delay.js";

import { ethers } from "ethers";

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
      isVideoMenuDropped: false,
      isPopoverVisible: false,
      popoverTarget: null
    };
  },
  methods: {
    ...mapGetters(["getTippingContractWithSigner"]),
    endViewingVideo() {
      trackEvent({ category: "Viewing Video", action: "end" });
      this.$router.push({ path: "/" });
    },
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
    },
    async tipStreamer() {
      trackEvent({ category: "Viewing Video", action: "tip" });
      var overrideOptions = {
        gasLimit: 250000,
        gasPrice: 9000000000,
        nonce: 0,
        value: ethers.utils.parseEther("1.0")
      };
      await this.getTippingContractWithSigner().tip(
        "0x6537da7F34d3454fce2bD9534491935687014bBd",
        overrideOptions
      );
    }
  },
  async mounted() {
    this.popoverTarget = this.$refs.tipbutton;
    await delay(1200);
    this.$nextTick(() => {
      this.isPopoverVisible = true;

      document.querySelector(".popover-mask").style.display = "none";
      document.querySelector(".popover").addEventListener("click", () => {
        this.isPopoverVisible = false;
      });
    });
    await delay(900000);
    this.isPopoverVisible = false;
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
