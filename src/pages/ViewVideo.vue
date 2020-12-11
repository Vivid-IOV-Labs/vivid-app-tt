<template>
  <v-ons-page id="viewStreamPage">
    <base-video ref="videoplayer" :source="sourceMedia" :options="videoOptions">
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
            <!-- <v-ons-button
              @click="reportConfirm = true"
              class="btn btn--square  btn--opacity-soft btn--small "
            >
              <base-icon class="btn__icon" name="flag"></base-icon>
            </v-ons-button> -->
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
                  <a
                    class="btn btn--square  btn--opacity-soft btn--small  mb-2"
                    :href="currentMedia.shop.link"
                    target="_blank"
                  >
                    <base-icon
                      class="btn__icon"
                      name="shopping-cart"
                    ></base-icon>
                  </a>
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
              {{ title }}
            </h5>
            <p class="stream-detail__hashtag">
              {{ hashtags }}
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
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters("media", ["getById"]),
    ...mapGetters("smartcontract", ["getTippingContractWithSigner"]),
    mediaID() {
      return this.$route.params.mediaID;
    },
    currentMedia() {
      return this.getById(this.mediaID);
    },
    videoUrl() {
      const url = `https://streams.vividiov.media:5443/WebRTCAppEE/streams/${this.mediaID}.mp4`;
      return url;
    },
    sourceMedia() {
      return {
        type: "video",
        title: "Example title",
        sources: [
          {
            // src: this.videoUrl,
            src:
              "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
            type: "video/mp4",
            size: "720"
          }
        ]
      };
    },
    title() {
      if (
        this.currentMedia &&
        this.currentMedia.details &&
        this.currentMedia.details.title
      ) {
        return this.currentMedia.details.title;
      } else {
        return "";
      }
    },
    hashtags() {
      if (
        this.currentMedia &&
        this.currentMedia.details &&
        this.currentMedia.details.twitter &&
        this.currentMedia.details.twitter.hashtags
      ) {
        return this.currentMedia.details.twitter.hashtags
          .reduce((acc, tag) => {
            acc += ` #${tag},`;
            return acc;
          }, "")
          .slice(1, -1);
      } else {
        return "";
      }
    }
  },
  methods: {
    endViewingVideo() {
      trackEvent({ category: "Viewing Video", action: "end" });
      this.$router.back();
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
      await this.getTippingContractWithSigner.tip(
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

      const popOverMask = document.querySelectorAll(".popover-mask")[1];
      popOverMask.style.display = "none";
      const popOver = document.querySelectorAll(".popover")[1];
      popOver.addEventListener("click", () => {
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
