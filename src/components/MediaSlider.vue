<template>
  <div ref="horizontal-scroller" class="horizontal-scroller">
    <div
      v-for="media in medias"
      :key="media.mediaID"
      class="horizontal-scroller__item"
    >
      <video-list-item :media="media"></video-list-item>
    </div>
    <div ref="sentinel" class="sentinel"></div>
  </div>
</template>

<script>
import VideoListItem from "@/components/VideoListItem.vue";

export default {
  data: function() {
    return {
      observer: null
    };
  },
  props: {
    medias: {
      type: Array,
      required: true
    }
  },
  components: {
    VideoListItem
  },
  created() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el,
      threshold: 1.0
    });
  },
  methods: {
    onElementObserved(entries) {
      entries.forEach(event => {
        console.log(event);
        // do something ...
      });
    }
  },
  mounted() {
    this.observer.observe(this.$refs.sentinel);
  },
  beforeDestroy() {
    this.observer.disconnect();
  }
};
</script>
<style lang="scss">
.horizontal-scroller {
  display: grid;
  grid-template-columns: repeat(6, minmax(360px, 1fr));
  grid-gap: 0 2rem;
  padding: 0.6rem 0.4rem;
  padding-right: 0;
  overflow: scroll;
}
</style>
