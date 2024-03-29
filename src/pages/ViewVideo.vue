<template>
  <v-ons-page id="viewStreamPage">
    <base-video
      ref="videoplayer"
      :title="title"
      :media_id="mediaID"
      :source="sourceMedia"
      :options="videoOptions"
      parent-page="Video Play View"
    >
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
              <span id="total-tips" class="ml-2">{{ totalTips }}</span>
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
                class="btn btn--back btn--opacity-soft btn--square mb-2"
              >
                <base-icon class="btn__icon" name="chevron-left"></base-icon>
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
                    :href="getCurrentMedia.shop.link"
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
                id="tip-streamer"
                @click="tipStreamer"
                :disabled="isTipping"
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
      <p class="text-bold text-center">Click here to tip 1TT</p>
    </v-ons-popover>
    <v-ons-popover
      cancelable
      :visible.sync="isPopoverTTProgress"
      :target="popoverTarget"
    >
      <div style="padding:1rem">
        <div class="dot-flashing"></div>
      </div>
    </v-ons-popover>
    <v-ons-popover
      cancelable
      :visible.sync="isPopoverTTSuccess"
      :target="popoverTarget"
    >
      <p class="text-bold text-center">
        1TT tip sent. Thanks! &#128512;
      </p>
    </v-ons-popover>
    <v-ons-popover
      cancelable
      :visible.sync="isPopoverTTFailed"
      :target="popoverTarget"
    >
      <p class="text-bold text-center">
        Tipping failed &#128549;
      </p>
    </v-ons-popover>
  </v-ons-page>
</template>
<script>
let watched;
import BaseVideo from "@/components/BaseVideo.vue";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { trackEvent } from "@/util/analytics";
import delay from "@/util/delay.js";
import env from "@/env.js";
import TipService from "@/services/TipService";
import webSocketService from "@/util/webSocketService.js";
import devLog from "@/util/devlog.js";
import Hls from "hls.js";
import MediaService from "@/services/MediaService";
function bigNumberFormatter(numberToFormat) {
  return Math.abs(numberToFormat) > 999999
    ? Math.sign(numberToFormat) *
        (Math.abs(numberToFormat) / 1000000).toFixed(1) +
        "M"
    : Math.abs(numberToFormat) > 999
    ? Math.sign(numberToFormat) * (Math.abs(numberToFormat) / 1000).toFixed(1) +
      "K"
    : Math.sign(numberToFormat) * Math.abs(numberToFormat);
}
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
      isFullScreen: false,
      isTipping: false,
      isPopoverClickTT: false,
      isPopoverTTSuccess: false,
      isPopoverTTFailed: false,
      isPopoverTTProgress: false,
      popoverTarget: null
    };
  },
  computed: {
    ...mapGetters("media", ["getCurrentMedia"]),
    ...mapGetters("smartcontract", ["getTipContract", "getUserWalletAddress"]),
    ...mapState("uistates", ["isTTPopOverVisited"]),
    mediaID() {
      return this.$route.params.mediaID;
    },
    videoUrl() {
      const url = `${env.media_server}/${this.mediaID}.mp4`;
      return url;
    },
    hlsUrl() {
      const url = `${env.media_hls}/${this.mediaID}.m3u8`;
      return url;
    },
    posterUrl() {
      const url = `${env.media_storage}/${this.mediaID}.png`;
      return url;
    },
    title() {
      if (
        this.getCurrentMedia &&
        this.getCurrentMedia.details &&
        this.getCurrentMedia.details.title
      ) {
        return this.getCurrentMedia.details.title;
      } else {
        return "";
      }
    },
    hashtags() {
      if (
        this.getCurrentMedia &&
        this.getCurrentMedia.details &&
        this.getCurrentMedia.details.twitter &&
        this.getCurrentMedia.details.twitter.hashtags
      ) {
        return this.getCurrentMedia.details.twitter.hashtags
          .reduce((acc, tag) => {
            acc += ` #${tag},`;
            return acc;
          }, "")
          .slice(1, -1);
      } else {
        return "";
      }
    },
    sourceMedia() {
      return {
        type: "video",
        title: this.title,
        mediaID: this.mediaID,
        poster: this.posterUrl
      };
    },
    totalTips: {
      get() {
        if (
          this.getCurrentMedia &&
          this.getCurrentMedia.statistics &&
          this.getCurrentMedia.statistics.total &&
          this.getCurrentMedia.statistics.total.tips
        ) {
          return bigNumberFormatter(this.getCurrentMedia.statistics.total.tips);
        } else {
          return 0;
        }
      },
      set(newVal) {
        this.setTotalTip({
          totalTips: newVal
        });
      }
    }
  },
  methods: {
    ...mapActions("media", ["populateCurrentMedia"]),
    ...mapMutations("media", ["setTotalTip"]),
    ...mapMutations("uistates", ["serTTPopOverVisited"]),
    endViewingVideo() {
      trackEvent({
        category: "Video Play View",
        action: "close-video",
        label: "MediaId:" + this.mediaID
      });
      this.$router.back();
    },
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
    },
    async startTimer() {
      await delay(120000);
      this.isPopoverTTProgress = false;
      this.isPopoverTTProgress = false;
      if (!this.isFullScreen) {
        this.isPopoverTTFailed = true;
      }
    },
    async tipStreamer() {
      this.isPopoverClickTT = false;
      if (!this.isFullScreen) {
        this.isTipping = true;
        this.isPopoverTTProgress = true;
      }
      try {
        const result = await this.getTipContract(
          this.getCurrentMedia.publisher.walletAddress
        );
        this.startTimer();
        const { transactionHash } = await result.wait();
        await TipService.verify({
          transactionHash,
          mediaID: this.mediaID
        });
        trackEvent({
          category: "Video Play View",
          action: "tip-video-started",
          label: "MediaId:" + this.mediaID
        });
      } catch (err) {
        this.isPopoverTTProgress = false;
        if (!this.isFullScreen) {
          this.isPopoverTTFailed = true;
        }
        this.isTipping = false;
        await delay(3000);
        this.isPopoverTTFailed = false;
        devLog(err);
      }
    },
    autoplay(video) {
      //clear all the listener on destroy?
      if (!video) return;
      if (document.querySelector(".plyr__control--overlaid")) {
        document
          .querySelector(".plyr__control--overlaid")
          .removeAttribute("style");
      }

      var promise = video.play();
      if (promise !== undefined) {
        promise
          .catch(() => {
            trackEvent({
              category: "Video Play View",
              action: "autoplay-error",
              label: "MediaId:" + this.mediaID
            });
          })
          .then(() => {
            trackEvent({
              category: "Video Play View",
              action: "autoplay-success",
              label: "MediaId:" + this.mediaID
            });
          });
      }
    },
    attachHls(event) {
      const video = event.detail.plyr;
      video.media.parentNode.parentNode.classList.add("plyr--loading");
      document.querySelector(".plyr__control--overlaid").style.display = "none";
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(this.hlsUrl);
        hls.attachMedia(video.media);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.media.addEventListener("loadedmetadata", () => {
            this.autoplay(video.media);
          });
        });
        trackEvent({
          category: "Video Play View",
          action: "hls-video-playing",
          label: "MediaId:" + this.mediaID
        });
      } else if (video.media.canPlayType("application/vnd.apple.mpegurl")) {
        video.media.src = this.hlsUrl;
        video.media.addEventListener("loadedmetadata", () => {
          this.autoplay(video.media);
          trackEvent({
            category: "Video Play View",
            action: "hls-video-playing",
            label: "MediaId:" + this.mediaID
          });
        });
      } else {
        video.media.src = this.videoUrl;
        video.media.addEventListener("loadedmetadata", () => {
          video.media.muted = "muted";
          video.media.autoplay = "autoplay";
          video.media.playsinline = "true";
          this.autoplay(video.media);
          trackEvent({
            category: "Video Play View",
            action: "mp4-video-playing",
            label: "MediaId:" + this.mediaID
          });
        });
      }
    },
    async countVideoViewed() {
      const mediaID = this.mediaID;
      const userWalletAddress = this.getUserWalletAddress;
      const percentageWatched = this.getPercentageVideoWatched() || 0;
      await MediaService.videoViewed({
        mediaID,
        userWalletAddress,
        percentageWatched
      });
    },
    async updateTip({ data }) {
      const { mediaID, sender, totalTips } = data;

      if (mediaID == this.mediaID) {
        this.totalTips = totalTips;
      }
      if (
        mediaID == this.mediaID &&
        this.getUserWalletAddress == sender.walletAddress
      ) {
        this.isTipping = false;

        this.isPopoverTTProgress = false;
        if (!this.isFullScreen) {
          this.isPopoverTTSuccess = true;
        }
        trackEvent({
          category: "Video Play View",
          action: "tip-video-verified",
          label: "MediaId:" + this.mediaID
        });
        await delay(3000);
        this.isPopoverTTSuccess = false;
      }
    },
    getPercentageVideoWatched() {
      const secondsWatched = Array.from(watched).length;
      const secondsDuration = Math.ceil(this.player.duration);
      const percentageWatched = Math.round(
        (secondsWatched / secondsDuration) * 100
      );
      return percentageWatched; // >= 100 ? percentageWatched : 100;
    },
    recordVideoWatched() {
      watched = new Set();
      this.player.on("timeupdate", () => {
        watched.add(Math.ceil(this.player.currentTime));
      });
      this.player.on("ended", () => {
        this.countVideoViewed();
      });
    },
    async showTipPopUp() {
      if (this.isTTPopOverVisited) return;
      await delay(1200);
      this.serTTPopOverVisited();
      this.$nextTick(() => {
        this.isPopoverClickTT = true;
        const popOverMask = document.querySelector(
          ".isPopoverClickTT .popover-mask"
        );
        popOverMask.style.display = "none";
        const popOver = document.querySelector(".isPopoverClickTT .popover");
        popOver.addEventListener("click", () => {
          this.isPopoverClickTT = false;
        });
      });
      await delay(10000);
      this.isPopoverClickTT = false;
    }
  },
  async mounted() {
    this.popoverTarget = this.$refs.tipbutton;
    this.player = this.$refs.videoplayer.player;
    this.recordVideoWatched();
    this.showTipPopUp();
    this.player.on("ready", this.attachHls);
    this.player.on("ended", this.countVideoViewed);
    this.player.on("enterfullscreen", () => {
      this.isFullScreen = true;
      this.isPopoverClickTT = false;
      this.isPopoverTTSuccess = false;
      this.isPopoverTTFailed = false;
      this.isPopoverTTProgress = false;
    });
    this.player.on("exitfullscreen", () => (this.isFullScreen = false));
    webSocketService.socket.on("media-updated-tip", this.updateTip);
    await this.populateCurrentMedia({ mediaID: this.mediaID });
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
