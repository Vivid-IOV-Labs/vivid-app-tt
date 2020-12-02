<template>
  <div class="video__container">
    <video ref="video" crossorigin playsinline></video>
  </div>
</template>

<script>
import Plyr from "plyr";
import "plyr/dist/plyr.css";
export default {
  name: "BsseVideo",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.player = new Plyr(this.$refs.video, this.options);
    this.player.source = {
      type: "video",
      title: "Example title",
      sources: [
        {
          src:
            "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
          type: "video/mp4",
          size: 576
        },
        {
          src:
            "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
          type: "video/mp4",
          size: 720
        },
        {
          src:
            "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4",
          type: "video/webm",
          size: 1080
        }
      ],
      poster:
        "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
    };
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
      this.player.destroy();
    }
  }
};
</script>
<style lang="scss">
.video__container {
  width: 100%;
  height: 100%;
  position: relative;
  .video__controls {
    padding: 1rem;
    position: absolute;
    z-index: 9999;
  }
  .plyr,
  .plyr__video-wrapper {
    height: 100%;
  }
  .plyr video {
    min-height: 100%;
    height: 100%;
    width: 100%;
  }
  .video--cover {
    object-fit: cover;
  }
  .plyr--full-ui input[type="range"] {
    color: $azure;
  }
  .plyr__control--overlaid {
    background-color: $azure;
  }
  .plyr__control {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0.4rem;
  }
  .plyr__control:hover {
    background: $azure;
  }
}
</style>
