<template>
  <div class="full-width medialist__item ">
    <div class="medialist__item_picture-frame">
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

export default {
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  components: {
    BaseIcon
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
  }
};
</script>
<style lang="scss">
.medialist__item {
  position: relative;
  border-bottom: solid 2px $dark-grey;
  padding: 0.6rem 0rem 1.4rem;
}
.medialist__item_picture-frame {
  margin-bottom: 0.8rem;
  width: 100%;
}
.medialist__item_poster {
  object-fit: contain;
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
  padding: 0.2rem 0 0rem;
}
</style>
