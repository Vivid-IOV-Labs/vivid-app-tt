<template>
  <div class="flex-center-y full-width medialist__item ">
    <img
      class="medialist__item_poster"
      :src="posterUrl"
      :alt="media.details.title"
    />
    <div class="px-2 medialist__item__title">
      {{ media.details.title }}
      <base-icon class="ml-auto" name="angle-right"></base-icon>
    </div>
  </div>
</template>

<script>
import BaseIcon from "@/components/BaseIcon.vue";
import env from "@/env.js";

export default {
  name: "VideoList",
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
    }
  }
};
</script>
<style lang="scss">
.medialist__item {
  position: relative;
  border-bottom: solid 2px $dark-grey;
  padding: 1.2rem 0rem;
}
.medialist__item_poster {
  object-fit: contain;
  width: 100%;
  border-radius: 0.6rem;
}
.medialist__item__title {
  position: absolute;
  bottom: 2rem;
  font-size: -8.8rem;
  padding: 0.6rem 1rem;
  background: rgb(0, 0, 0, 0.6);
}
</style>
