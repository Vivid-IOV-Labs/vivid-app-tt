<template>
  <div ref="slidercontainer" class="horizontal-scroll-container">
    <div
      ref="slider"
      :style="{
        gridTemplateColumns: `repeat(${medias.length}, minmax(360px, 1fr)) 20px`
      }"
      class="horizontal-scroller"
    >
      <div
        v-for="media in medias"
        :key="media.mediaID"
        class="horizontal-scroller__item"
      >
        <video-list-item :media="media"></video-list-item>
      </div>
      <div ref="rightsentinel" class="sentinel"></div>
    </div>
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
      entries.forEach(entry => {
        //https://codepen.io/aartyparty/pen/bGVzKjM?editors=1011
        // const classes = {
        //   leftScrim: "horizontal-scroll-container__left-scrim",
        //   rightScrim: "horizontal-scroll-container__right-scrim"
        // };
        //const { firstChild } = this.$refs.slider;
        // const scrimClass =
        //   entry.target === firstChild ? classes.leftScrim : classes.rightScrim;
        // if (entry.intersectionRatio != 1) {
        //   if (!this.$refs.slidercontainer.classList.contains(scrimClass)) {
        //     this.$refs.slidercontainer.classList.add(scrimClass);
        //   }
        // } else {
        //   this.$refs.slidercontainer.classList.remove(scrimClass);
        // }
        if (entry.isIntersecting) {
          console.log("intersected");
          this.$emit("intersect");
          this.observer.disconnect();
        }
      });
    }
  },
  mounted() {
    if (this.medias.length > 2) {
      this.$nextTick(() => {
        const rightsentinel = this.$refs.rightsentinel;
        this.observer.observe(rightsentinel);
      });
    }
  },
  beforeDestroy() {
    this.observer.disconnect();
  }
};
</script>
<style lang="scss">
.horizontal-scroll-container {
  width: 100%;
  position: relative;

  &__left-scrim {
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 10%;
      height: 100%;
      background: linear-gradient(to right, #666, transparent);
    }
  }

  &__right-scrim {
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 10%;
      height: 100%;
      background: linear-gradient(to left, #666, transparent);
    }
  }
  .horizontal-scroller {
    display: grid;
    grid-gap: 0 2rem;
    padding-right: 0;
    overflow-y: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
