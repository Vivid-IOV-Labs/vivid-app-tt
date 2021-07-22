<template>
  <div class="full-width medialist__item ">
    <div class="rewards">
      <div class="flex" style="align-items: baseline;">
        <div v-if="!media.rewards">
          <span class="progress_description ">
            <span
              v-if="
                media.balanceAvailable == 0 &&
                  (!media.viewsProgress ||
                    media.viewsProgress.percentageWatched == 0)
              "
            >
              Start watching ...</span
            >
            <span v-else>
              Start watching to get TT!
            </span>
            <br />
            <small
              v-if="
                media.balanceAvailable &&
                  media.balanceTotal &&
                  !(balancePercentage == 0.0 || balancePercentage == 100.0)
              "
              >{{ balancePercentage }}% of available TT for this promotion has
              been claimed</small
            >
          </span>
        </div>
        <div
          v-if="
            media.rewards &&
              media.rewards.rewardVerifiedTxHash &&
              media.rewards.rewardVerifiedTxHash
          "
        >
          <span class="progress_description text-azure">
            Completed! +1TT gained!
          </span>
        </div>
        <div
          v-if="
            media.rewards &&
              media.rewards.rewardSmartContractTxHash &&
              !media.rewards.rewardVerifiedTxHash
          "
        >
          <span class="progress_description text-azure">
            Nice one! Your TT is now available to be claimed in Quest”
          </span>
        </div>
        <div
          v-if="
            media.rewards &&
              !media.rewards.rewardSmartContractTxHash &&
              !media.rewards.rewardVerifiedTxHash
          "
        >
          <span class="progress_description">
            <span
              v-if="
                media.balanceAvailable == 0 &&
                  media.viewsProgress.percentageWatched == 100
              "
            >
              Thanks for watching</span
            >
            <span v-else>Keep watching... </span>
            <br />
            <small
              v-if="
                media.balanceAvailable &&
                  media.balanceTotal &&
                  !(balancePercentage == 0.0 || balancePercentage == 100.0)
              "
              >{{ balancePercentage }}% of available TT for this promotion has
              been claimed</small
            >
          </span>
        </div>
      </div>
    </div>
    <div
      @click="pushToVideo(media.mediaID)"
      class="medialist__item_picture-frame"
    >
      <div class="medialist__item_picture-frame_badge--reward flex-center-xy">
        <base-icon
          :class="{
            'text-azure':
              media.rewards && !!media.rewards.rewardSmartContractTxHash
          }"
          name="reward"
        ></base-icon>
      </div>
      <img
        class="medialist__item_poster"
        v-lazy="imgObj"
        :alt="media.details.title"
      />
    </div>
    <div>
      <earn-progress-bar
        :completed="
          media.rewards ? !!media.rewards.rewardSmartContractTxHash : false
        "
        :percentage="
          media.viewsProgress ? media.viewsProgress.percentageWatched : 0
        "
      ></earn-progress-bar>
    </div>
    <div class="mt-2">
      <div class="medialist__item__title mb-2">
        {{ media.details.title }} <span class="text-bold text-azure">#ad </span>
        <base-icon class="ml-auto" name="angle-right"></base-icon>
      </div>
      <a
        v-if="media.details.moreInfo"
        :href="media.details.moreInfo"
        @click="trackLink(media.details.moreInfo, media.mediaID)"
        target="_blank"
        class="btn btn--small btn--secondary mt-4"
        >Learn More</a
      >
    </div>
    <hr class="hr-border" />
  </div>
</template>

<script>
import BaseIcon from "@/components/BaseIcon.vue";
import env from "@/env.js";
import EarnProgressBar from "@/components/EarnProgressBar.vue";
import { trackEvent } from "@/util/analytics";
const truncate = (str, max = 10) => {
  const array = str.trim().split(" ");
  const ellipsis = array.length > max ? "..." : "";

  return array.slice(0, max).join(" ") + ellipsis;
};
export default {
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  components: {
    BaseIcon,
    EarnProgressBar
  },
  computed: {
    posterUrl() {
      const url = `${env.media_storage}/${this.media.mediaID}.png`;
      return url;
    },
    balanceAvailable() {
      return this.media.balanceAvailable || 0;
    },
    imgObj() {
      return {
        src: this.posterUrl,
        error: "/thumbnail.jpg",
        loading: "/thumbnail.jpg"
      };
    },
    balancePercentage() {
      if (this.media.balanceAvailable && this.media.balanceTotal) {
        return (
          100 -
          (this.media.balanceAvailable / this.media.balanceTotal) * 100
        ).toFixed(1);
      } else {
        return 0;
      }
    },
    title() {
      return truncate(this.media.details.title, 6);
    }
  },
  methods: {
    trackLink(link, mediaID) {
      trackEvent({
        category: "Earn Video List View",
        action: "link-more-info",
        label: "MediaID:" + mediaID
      });
      trackEvent({
        category: "Earn Video List View",
        action: "link-more-info",
        label: link
      });
    },
    hasRewarded(media) {
      return media.rewards && !!media.rewards.rewardSmartContractTxHash;
    },
    pushToVideo(mediaID) {
      trackEvent({
        category: "Earn Video List View",
        action: "select-video",
        label: "MediaId:" + this.mediaID
      });
      this.$router.push({ path: `earnviewvideo/${mediaID}` });
    }
  }
};
</script>
<style lang="scss">
.rewards {
  padding: 1rem 0 0.4rem;
}

.medialist__item_picture-frame {
  position: relative;
  margin-bottom: 0.8rem;
  width: 100%;
  // max-height: 240px;
}
.medialist__item_picture-frame_badge--reward {
  background: $black;
  position: absolute;
  width: 2rem;
  height: 2rem;
  border: solid 2px $white;
  border-radius: 50%;
  top: 0.6rem;
  right: 0.6rem;
}
.medialist__item_poster {
  object-fit: contain;
  width: 100%;
  border-radius: 0.6rem;
}
.medialist__item__caption {
  position: absolute;
  width: 100%;
  bottom: 3rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.6rem 1rem;
}
.medialist__item__title {
  font-family: "Prompt", sans-serif;
  font-weight: bold;
  padding: 0.2rem 0 0rem;
}
.progress_description {
  font-family: "Prompt", sans-serif;
  display: block;
  font-size: 0.9rem;
  font-weight: bold;
}
.hr-border {
  border: none;
  padding: 0.8rem 0 0.4rem;
  border-bottom: solid 0.2rem $dark-grey;
}
</style>
