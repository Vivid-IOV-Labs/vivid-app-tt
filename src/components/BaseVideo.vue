<template>
  <div class="video__container">
    <slot name="top"></slot>

    <video
      id="video"
      ref="video"
      crossorigin
      playsinline
      preload="auto"
    ></video>
    <div class="loading ">
      <base-icon name="spinner" :spin="true"></base-icon>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>

<script>
import Plyr from "plyr";
// import Hls from "hls.js";
import BaseIcon from "@/components/BaseIcon.vue";
import { trackEvent } from "@/util/analytics";
// import "plyr/dist/plyr.css";

const totalSecondsToHMS = totalSecs => {
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = Math.floor(totalSecs % 60);
  const formattedHH = hours.toString().padStart(2, "0");
  const formattedMM = minutes.toString().padStart(2, "0");
  const formattedSS = seconds.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
};

export default {
  name: "BsseVideo",
  components: {
    BaseIcon
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    source: {
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
  methods: {
    fixMobileClick() {
      const player = this.player;
      const { wrapper, container } = player.elements;
      if (!container._clickListener) {
        container._clickListener = event => {
          const targets = [container, wrapper];
          if (
            !targets.includes(event.target) &&
            !wrapper.contains(event.target)
          ) {
            return;
          }

          if (player.touch) player.togglePlay();
        };
        container.addEventListener("click", container._clickListener);
      }
    }
  },
  async mounted() {
    this.player = new Plyr(this.$refs.video, this.options);

    this.player.source = this.source;

    this.$nextTick(() => {
      document
        .querySelector(".plyr--video")
        .appendChild(document.querySelector(".loading"));
      this.fixMobileClick();
      const videoWrapper = document.getElementsByClassName(
        "plyr__video-wrapper"
      )[0];
      videoWrapper.addEventListener("click", event => {
        this.player.togglePlay();
        event.stopPropagation(); // Necessary or the video will toggle twice => no playback
      });

      this.player.toggleControls(false);
    });

    this.player.on("ready", () => {
      trackEvent({
        category: "Video Play View",
        action: "play-video",
        label: "MediaId:" + this.source.mediaID
      });
    });
    this.player.on("pause", () => {
      trackEvent({
        category: "Video Play View",
        action: "pause-video",
        label: "MediaId:" + this.source.mediaID
      });
    });
    this.player.on("ended", () => {
      trackEvent({
        category: "Video Play View",
        action: "finished-video",
        label: "MediaId:" + this.source.mediaID
      });
    });
    this.player.on("timeupdate", () => {
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
@import "~plyr/src/sass/plyr.scss";
.video__container {
  width: 100%;
  height: 100%;
  position: relative;
  .loading {
    display: none;
    left: 50%;
    opacity: 0.9;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: 0.3s;
    z-index: 2;
    font-size: 2.4rem;
    padding: 1rem;
    background: none;
  }
  .plyr--loading {
    .loading {
      display: block;
    }
  }
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
    min-height: 100%;
    height: 100%;
    width: 100%;
  }
  @media screen and (orientation: portrait) {
    .islive video {
      object-fit: cover;
    }
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
