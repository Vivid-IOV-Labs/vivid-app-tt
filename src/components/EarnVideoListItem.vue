<template>
  <div class="full-width medialist__item ">
    <div class="rewards">
      <div class="flex p-2" style="align-items: baseline;">
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
            Nice one! 1TT claimed!
          </span>
        </div>
        <div
          v-if="
            media.rewards &&
              !media.rewards.rewardSmartContractTxHash &&
              !media.rewards.rewardVerifiedTxHash
          "
        >
          <span class="progress_description">Keep watching to get TT</span>
        </div>
        <a
          href="https://www.vividiov.com/"
          target="_blank"
          class="btn btn--secondary ml-auto"
          >Learn More</a
        >
      </div>
      <div v-if="media.rewards">
        <earn-progress-bar
          :completed="
            media.rewards && !!media.rewards.rewardSmartContractTxHash
          "
          :percentage="media.rewards.percentageWatched"
        ></earn-progress-bar>
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
          name="dollar-sign"
        ></base-icon>
      </div>
      <img
        class="medialist__item_poster"
        v-lazy="imgObj"
        :alt="media.details.title"
      />
    </div>
    <span class="medialist__item__title">
      {{ media.details.title }}
      <base-icon class="ml-auto" name="angle-right"></base-icon>
    </span>
  </div>
</template>

<script>
import BaseIcon from "@/components/BaseIcon.vue";
import env from "@/env.js";
import EarnProgressBar from "@/components/EarnProgressBar.vue";
import { trackEvent } from "@/util/analytics";

export default {
  name: "EarnVideoList",
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
    imgObj() {
      return {
        src: this.posterUrl,
        error: "/thumbnail.jpg",
        loading: "/thumbnail.jpg"
      };
    }
  },
  methods: {
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
  padding: 1rem 0;
}
.medialist__item {
  position: relative;
  border-bottom: solid 2px $dark-grey;
  padding: 0.6rem 0rem 1.4rem;
}
.medialist__item_picture-frame {
  position: relative;
  margin-bottom: 0.8rem;
  width: 100%;
  max-height: 240px;
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
  font-weight: bold;
  padding: 0.2rem 0 0rem;
}
.progress_description {
  margin-bottom: 0.6rem;
  display: block;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>
