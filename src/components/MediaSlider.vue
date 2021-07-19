<template>
  <div ref="slidercontainer" class="horizontal-scroll-container">
    <div
      ref="slider"
      :style="{
        gridTemplateColumns: `1px repeat(${medias.length}, minmax(360px, 1fr)) 1px`
      }"
      class="horizontal-scroller"
    >
      <div ref="leftsentinel" class="sentinel"></div>
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
    },
    total: {
      type: Number,
      required: true
    }
  },
  components: {
    VideoListItem
  },
  created() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el,
      threshold: 0.5,
      rootMargin: "0px 20px"
    });
  },
  methods: {
    onElementObserved(entries) {
      entries.forEach(entry => {
        const rightsentinel = this.$refs.rightsentinel;
        if (entry.target === rightsentinel) {
          if (entry.isIntersecting) {
            console.log("intersected");
            this.$emit("intersect");
          }
        }
        // const classes = {
        //   leftScrim: "horizontal-scroll-container__left-scrim",
        //   rightScrim: "horizontal-scroll-container__right-scrim"
        // };
        // const scrimClass =
        //   entry.target === rightsentinel
        //     ? classes.rightScrim
        //     : classes.leftScrim;
        // if (entry.intersectionRatio != 1) {
        //   if (!this.$refs.slidercontainer.classList.contains(scrimClass)) {
        //     this.$refs.slidercontainer.classList.add(scrimClass);
        //   }
        // } else {
        //   this.$refs.slidercontainer.classList.remove(scrimClass);
        // }
      });
    }
  },
  // computed: {
  //   isAllFetched() {
  //     return this.medias.length < this.total;
  //   }
  // },
  // watch: {
  //   medias: {
  //     handler(medias) {
  //       if (medias.length < this.total) {
  //         this.observer.disconnect();
  //       }
  //     }
  //   }
  // },
  mounted() {
    if (this.medias.length > 1) {
      this.$nextTick(() => {
        const rightsentinel = this.$refs.rightsentinel;
        this.observer.observe(rightsentinel);
        const leftsentinel = this.$refs.leftsentinel;
        this.observer.observe(leftsentinel);
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
      background: linear-gradient(to right, #111, transparent);
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
      background: linear-gradient(to left, #111, transparent);
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
