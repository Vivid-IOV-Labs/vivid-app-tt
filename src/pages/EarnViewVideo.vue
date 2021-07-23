<template>
  <v-ons-page id="viewStreamPage">
    <base-video
      ref="videoplayer"
      :title="title"
      :media_id="mediaID"
      :source="sourceMedia"
      :options="videoOptions"
      parent-page="Earn Video Play View"
    >
      <template v-slot:top>
        <div class="stream__controls stream__controls--top">
          <div class="flex">
            <div
              style="border:solid 2px #fff"
              class="btn--fake btn--small btn--primary btn--round btn--opacity-soft flex-center-xy ml-2"
              id="rewardicon"
            >
              <base-icon
                class="btn__icon"
                :class="{ 'text-azure': hasRewarded || isRewardEarned }"
                style="font-size:1.4rem"
                name="reward"
              ></base-icon>
            </div>
            <v-ons-popover
              class="rewardPopOver"
              :visible.sync="isPopoverReward"
              direction="right"
              target="#rewardicon"
            >
              <div style="padding:1rem">
                <div class="dot-flashing"></div>
              </div>
            </v-ons-popover>
          </div>

          <div class="ml-auto flex">
            <div class="flex-column ml-2">
              <v-ons-button
                @click="endViewingVideo"
                :disabled="isCountingView"
                class="btn  btn--opacity-soft btn--square btn--back mb-2"
              >
                <base-icon class="btn__icon" name="chevron-left"></base-icon>
              </v-ons-button>
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
            <p v-if="subtitle" class="stream-detail__hashtag">
              {{ subtitle }}
            </p>
          </div>
          <div v-if="moreInfo" class=" ml-auto flex-column ">
            <div>
              <a
                :href="moreInfo"
                target="_blank"
                @click="trackLink(moreInfo, mediaID)"
                class="btn btn--round-large btn--opacity-dark mb-2 link-more"
                style="border:solid 2px #fff; display:block"
              >
                <base-icon class="btn__icon" name="link"></base-icon>
              </a>
            </div>
          </div>
        </div>
      </template>
    </base-video>
    <reward-earned-dialog
      :on-close="pushUserBack"
      v-model="isRewardEarnedDialog"
    ></reward-earned-dialog>
  </v-ons-page>
</template>
<script>
import BaseVideo from "@/components/BaseVideo.vue";
import { mapGetters, mapActions } from "vuex";
import { trackEvent } from "@/util/analytics";
import env from "@/env.js";
import webSocketService from "@/util/webSocketService.js";
import Hls from "hls.js";
import MediaService from "@/services/MediaService";
import RewardEarnedDialog from "@/components/dialogs/RewardEarnedDialog.vue";
let watched = new Set();

export default {
  components: {
    BaseVideo,
    RewardEarnedDialog
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
      isRewardEarned: false,
      isRewardEarnedDialog: false,
      popoverVisible: false,
      mediaID: this.$route.params.mediaID,
      percentageWatched: 0,
      isCountingView: false,
      goBack: false
    };
  },
  computed: {
    ...mapGetters("media", ["getCurrentMedia"]),
    ...mapGetters("smartcontract", ["getUserWalletAddress"]),
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
    subtitle() {
      if (
        this.getCurrentMedia &&
        this.getCurrentMedia.details &&
        this.getCurrentMedia.details.subtitle
      ) {
        return this.getCurrentMedia.details.subtitle;
      } else {
        return "";
      }
    },
    moreInfo() {
      if (
        this.getCurrentMedia &&
        this.getCurrentMedia.details &&
        this.getCurrentMedia.details.moreInfo
      ) {
        return this.getCurrentMedia.details.moreInfo;
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
    hasRewarded() {
      return (
        this.getCurrentMedia &&
        this.getCurrentMedia.rewards &&
        this.getCurrentMedia.rewards[0] &&
        this.getCurrentMedia.rewards[0].rewardSmartContractTxHash
      );
    },
    isPopoverReward() {
      return (
        this.isCountingView &&
        !this.hasRewarded &&
        this.getPercentageVideoWatched() >= 80
      );
    }
  },
  methods: {
    ...mapActions("uistates", ["setTaskQueue"]),
    ...mapActions("media", ["populateCurrentMedia"]),

    trackLink(link, mediaID) {
      !this.hasRewarded &&
        trackEvent({
          category: "Earn Video Play View",
          action: "link-more-info",
          label: link
        });
      !this.hasRewarded &&
        trackEvent({
          category: "Earn Video Play View",
          action: "link-more-info",
          label: "MediaId:" + mediaID
        });
    },
    pushUserBack() {
      this.isRewardEarned = true;
      if (this.goBack) {
        this.$router.push({ path: "/earnvideolist" });
      }
    },
    async endViewingVideo() {
      !this.hasRewarded &&
        trackEvent({
          category: "Earn Video Play View",
          action: "close-video",
          label: "MediaId:" + this.mediaID
        });
      try {
        this.setTaskQueue({ name: "rewardVideo", loading: true });
        const { success } = await this.countVideoViewed();
        if (!success) {
          this.$router.push({ path: "/earnvideolist" });
          return;
        }
      } catch (err) {
        this.$router.push({ path: "/earnvideolist" });
        return;
      } finally {
        this.setTaskQueue({ name: "rewardVideo", loading: false });
      }
      if (!this.hasRewarded) {
        if (this.getPercentageVideoWatched() >= 80) {
          this.goBack = true;
          return;
        } else {
          this.$router.push({ path: "/earnvideolist" });
          return;
        }
      } else {
        this.$router.push({ path: "/earnvideolist" });
        return;
      }
    },
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
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
            !this.hasRewarded &&
              trackEvent({
                category: "Earn Video Play View",
                action: "autoplay-error",
                label: "MediaId:" + this.mediaID
              });
          })
          .then(() => {
            !this.hasRewarded &&
              trackEvent({
                category: "Earn Video Play View",
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
        !this.hasRewarded &&
          trackEvent({
            category: "Earn Video Play View",
            action: "hls-video-playing",
            label: "MediaId:" + this.mediaID
          });
      } else if (video.media.canPlayType("application/vnd.apple.mpegurl")) {
        video.media.src = this.hlsUrl;
        video.media.addEventListener("loadedmetadata", () => {
          this.autoplay(video.media);
          !this.hasRewarded &&
            trackEvent({
              category: "Earn Video Play View",
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
            category: "Earn Video Play View",
            action: "mp4-video-playing",
            label: "MediaId:" + this.mediaID
          });
        });
      }
    },
    async countVideoViewed() {
      this.isCountingView = true;
      const mediaID = this.mediaID;
      const userWalletAddress = this.getUserWalletAddress;
      const percentageWatched = this.getPercentageVideoWatched();
      try {
        return await MediaService.videoViewed({
          mediaID,
          userWalletAddress,
          percentageWatched
        });
      } finally {
        this.isCountingView = false;
      }
    },
    getPercentageVideoWatched() {
      const secondsWatched = Array.from(watched).length;
      const secondsDuration = Math.ceil(this.player.duration);
      const percentageWatched = Math.round(
        (secondsWatched / secondsDuration) * 100
      );
      return percentageWatched || 0;
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
    rewardSent({ data }) {
      const { mediaID, userWalletAddress } = data;
      if (
        mediaID == this.mediaID &&
        userWalletAddress == this.getUserWalletAddress
      ) {
        trackEvent({
          category: "Earn Video Play View",
          action: "reward-sent",
          label: "MediaId:" + this.mediaID
        });
        this.isRewardEarnedDialog = true;
      }
    }
  },
  async mounted() {
    this.player = this.$refs.videoplayer.player;
    if (!this.hasRewarded) {
      this.recordVideoWatched();
    } else {
      this.player.on("ended", () => {
        this.countVideoViewed();
      });
    }
    this.player.on("ready", this.attachHls);
    this.player.on("enterfullscreen", () => {
      this.isFullScreen = true;
    });
    this.player.on("exitfullscreen", () => (this.isFullScreen = false));
    webSocketService.socket.on("media-reward-sent", this.rewardSent);
    const params = {
      mediaID: this.mediaID,
      userWalletAddress: this.getUserWalletAddress
    };
    await this.populateCurrentMedia(params);
  }
};
</script>
<style lang="scss">
.link-more {
  background: $violet !important;
}
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
