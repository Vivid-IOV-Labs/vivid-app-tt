<template>
  <div class="video__container">
    <video
      ref="video"
      width="100%"
      height="100%"
      webkit-playsinline
      playsinline
    ></video>
  </div>
</template>

<script>
import Plyr from "plyr";
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
    this.player = new Plyr(this.$refs.video, {
      controls: false,
      autoplay: true,
      muted: true
    });
    this.player.on("pause", () => {
      this.$emit("pause");
      this.isPaused = true;
    });

    this.player.on("play", () => {
      this.$emit("play");
      this.isPaused = false;
    });
    this.player.on("fullscreenchange", () => {
      if (!this.player.isFullscreen()) {
        this.player.play();
      }
    });
    this.player.on("timeupdate", () => {
      function totalSecondsToHMS(totalSecs) {
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = Math.floor(totalSecs % 60);
        const formattedHH = hours.toString().padStart(2, "0");
        const formattedMM = minutes.toString().padStart(2, "0");
        const formattedSS = seconds.toString().padStart(2, "0");

        return `${formattedHH}:${formattedMM}:${formattedSS}`;
      }
      const currentTime = totalSecondsToHMS(this.player.currentTime);
      this.$emit("timeupdate", currentTime);
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
<style lang="scss">
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
.plyr,
.plyr__video-wrapper {
  height: 100%;
}
.plyr video {
  object-fit: cover;
  min-height: 100%;
  height: 100%;
  width: 100%;
}
</style>
