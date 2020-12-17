<template>
  <v-ons-page id="viewStreamPage">
    <base-video ref="videoplayer" :source="sourceMedia" :options="videoOptions">
      <template v-slot:top>
        <div class="stream__controls stream__controls--top">
          <div class="flex">
            <!-- <v-ons-button
              class="btn btn--small btn--opacity-soft flex-center-xy"
            >
              <base-icon class="btn__icon" name="user"></base-icon>
              <span class="ml-2">101</span>
            </v-ons-button> -->
            <v-ons-button
              style="border:solid 2px #fff"
              class="btn btn--small btn--opacity-soft flex-center-xy ml-2"
            >
              <base-icon
                class="btn__icon"
                :fill="false"
                style="font-size:1.8rem"
                name="thundercore"
              ></base-icon>
              <span class="ml-2">{{ totalTips }}</span>
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
              <!-- <v-ons-button
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
              </transition> -->
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
              <v-ons-button
                @click.prevent="tipStreamer"
                class="btn btn--round-large btn--opacity-dark mb-2"
                style="font-size: 3.4rem; padding: 0.2rem 0 0 0.2rem; border:solid 2px #fff"
              >
                <base-icon
                  class="btn__icon"
                  :fill="false"
                  name="thundercore"
                ></base-icon>
              </v-ons-button>
            </div>
          </div>
        </div>
      </template>
    </base-video>
    <v-ons-popover
      class="isPopoverClickTT"
      :visible.sync="isPopoverClickTT"
      :target="popoverTarget"
    >
      <p class="bold text-center">Click here to tip 1TT</p>
    </v-ons-popover>
    <v-ons-popover
      cancelable
      :visible.sync="isPopoverTTSuccess"
      :target="popoverTarget"
    >
      <p class="bold text-center">Tip done! &#128512;</p>
    </v-ons-popover>
  </v-ons-page>
</template>
<script>
import BaseVideo from "@/components/BaseVideo.vue";
import { mapGetters, mapMutations } from "vuex";
import { trackEvent } from "@/util/analytics";
import delay from "@/util/delay.js";
import env from "@/env.js";
import TipService from "@/services/TipService";
import webSocketService from "@/util/webSocketService.js";

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
          "settings",
          "fullscreen"
        ],
        settings: ["speed", "loop"]
      },
      isVideoMenuDropped: false,
      isPopoverClickTT: false,
      isPopoverTTSuccess: false,
      popoverTarget: null
    };
  },
  computed: {
    ...mapGetters("media", ["getById"]),
    ...mapGetters("smartcontract", ["getTipContract"]),
    mediaID() {
      return this.$route.params.mediaID;
    },
    currentMedia() {
      return this.getById(this.mediaID);
    },
    videoUrl() {
      const url = `${env.media_server}/${this.mediaID}.mp4`;
      return url;
    },
    sourceMedia() {
      return {
        type: "video",
        title: "Example title",
        sources: [
          {
            src: this.videoUrl,
            type: "video/mp4"
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
    },
    totalTips: {
      get() {
        if (
          this.currentMedia.statistics &&
          this.currentMedia.statistics.total &&
          this.currentMedia.statistics.total.tips
        ) {
          return this.currentMedia.statistics.total.tips;
        } else {
          return 0;
        }
      },
      set(newVal) {
        this.setTotalTip({ mediaID: this.mediaID, totalTips: newVal });
      }
    }
  },
  methods: {
    ...mapMutations("media", ["setTotalTip"]),
    endViewingVideo() {
      trackEvent({ category: "Viewing Video", action: "end" });
      this.$router.back();
    },
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
    },
    async tipStreamer() {
      this.isPopoverClickTT = false;
      const result = await this.getTipContract();
      const { transactionHash } = await result.wait();
      await TipService.verify({
        transactionHash,
        mediaID: this.mediaID
      });
      trackEvent({ category: "Viewing Video", action: "tip" });
    }
  },
  async mounted() {
    webSocketService.socket.on("media-updated-tip", async ({ data }) => {
      const { totalTips } = data;
      this.totalTips = totalTips;
      this.isPopoverTTSuccess = true;
      await delay(3000);
      this.isPopoverTTSuccess = false;
    });
    this.popoverTarget = this.$refs.tipbutton;
    await delay(1200);
    this.$nextTick(() => {
      this.isPopoverClickTT = true;
      const popOverMask = document.querySelectorAll(".popover-mask")[1];
      popOverMask.style.display = "none";
      const popOver = document.querySelectorAll(".popover")[1];
      popOver.addEventListener("click", () => {
        this.isPopoverClickTT = false;
      });
    });
    await delay(900000);
    this.isPopoverClickTT = false;
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
