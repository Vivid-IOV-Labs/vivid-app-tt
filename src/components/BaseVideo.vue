<template>
  <div class="video__container">
    <video
      ref="video"
      class="video-js video-js vjs-default-skin vjs-fill"
      width="100%"
      height="100%"
      playsinline
      autoplay
      webkit-playsinline
      preload="auto"
    ></video>
  </div>
</template>

<script>
export default {
  name: "BsseVideo",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
      isPaused: {
        type: Boolean,
        default: false
      }
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.player = window.videojs(this.$refs.video, this.options);
    this.player.on("pause", () => {
      this.$emit("pause");
      this.isPaused = true;
    });

    this.player.on("play", () => {
      this.$emit("play");
      this.isPaused = false;
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
<style>
.video__container {
  width: 100%;
  height: 100%;
  position: relative;
}
.video__controls {
  padding: 1rem;
  position: absolute;
  z-index: 9999;
}
.video__container .vjs-tech {
  object-fit: cover;
  min-height: 100%;
  height: 100%;
}
</style>
