<template>
  <div @click="pushToVideo" class="full-width medialist__item ">
    <div class="medialist__item_picture-frame">
      <img
        class="medialist__item_poster"
        v-lazy="imgObj"
        :alt="media.details.title"
      />
    </div>
    <div class="medialist__item__descwrapper">
      <span class="medialist__item__title">
        {{ title }}
        <!-- <base-icon class="ml-auto" name="angle-right"></base-icon> -->
      </span>
    </div>
  </div>
</template>

<script>
// import BaseIcon from "@/components/BaseIcon.vue";
import env from "@/env.js";
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
    // BaseIcon
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
    },
    title() {
      return truncate(this.media.details.title, 6);
    }
  },
  methods: {
    pushToVideo() {
      trackEvent({
        category: "Video List View",
        action: "select-video",
        label: "MediaId:" + this.media.mediaID
      });
      this.$router.push({ path: `viewvideo/${this.media.mediaID}` });
    }
  }
};
</script>
<style lang="scss">
.medialist__item {
  position: relative;
  padding: 0.6rem 0rem 0.8rem;
  max-width: 380px;
}
.medialist__item_picture-frame {
  margin-bottom: 0.8rem;
  width: 100%;
}
.medialist__item_poster {
  object-fit: cover;
  width: 100%;
  max-height: 220px;
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
  font-size: 0.925rem;
  padding: 0.2rem 0 0rem;
  text-overflow: ellipsis;
}
.medialist__item__descwrapper {
  height: 3rem;
  padding: 0.2rem 0 0.4rem;
  max-lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
