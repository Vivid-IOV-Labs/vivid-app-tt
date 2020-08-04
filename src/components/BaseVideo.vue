<template>
  <div class="video__container">
    <video
      ref="video"
      class="video-js video-js vjs-default-skin vjs-16-9 vjs-fill"
    ></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "../../node_modules/video.js/dist/video-js.css";

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
    this.player = videojs(this.$refs.video, this.options);
    console.log(this.player);
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
  min-height: 100%; /* not good for the aspect ratio set square or landscape or vertical instead*/
}
</style>
