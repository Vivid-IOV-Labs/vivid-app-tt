<template>
  <div class="video__container">
    <slot name="top"></slot>

    <video ref="video" crossorigin playsinline preload="auto">
      <!-- <source src="@/assets/videos/santa5.mp4" type="video/mp4" /> -->
    </video>
    <slot name="bottom"></slot>
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
    const videoUrl =
      "https://cors-anywhere.herokuapp.com/https://stream.vividiov.media:5443/WebRTCAppEE/streams/953594478786080819185945.mp4";
    this.player.source = {
      type: "video",
      title: "Example title",
      sources: [{ src: videoUrl, type: "video/mp4" }]
    };
    // this.player.source = {
    //   type: "video",
    //   title: "Example title",
    // sources: [
    //   {
    //     src: "@/assets/videos/santa5.mp4"
    //   }
    // {
    //   src:
    //     "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    //   type: "video/mp4",
    //   size: 720
    // },
    // {
    //   src:
    //     "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4",
    //   type: "video/webm",
    //   size: 1080
    // }
    // ],
    //   poster:
    //     "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
    // };
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
  .plyr--video.plyr--menu-open + .stream__controls--bottom {
    z-index: 2;
  }
  .plyr--video.plyr--menu-open {
    z-index: 10;
  }
  .plyr__menu__container {
    z-index: 1000;
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
  .plyr--video .plyr__controls {
    padding: 1rem;
    z-index: 1003;
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
