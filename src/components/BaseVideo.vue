<template>
  <div class="video__container">
    <!-- <div class="video__controls">
      <v-ons-button classes="btn btn--info" @click="playPause">
        <v-ons-icon
          class="btn__icon"
          v-if="isPaused"
          icon="fa-play"
        ></v-ons-icon>
        <v-ons-icon class="btn__icon" v-else icon="fa-pause"></v-ons-icon>
      </v-ons-button>
    </div> -->

    <video
      ref="video"
      class="video-js video-js vjs-default-skin vjs-16-9"
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
      }
    }
  },
  data() {
    return {
      player: null,
      isPaused: true
    };
  },
  methods: {
    playPause() {
      if (this.isPaused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  },
  mounted() {
    this.player = videojs(this.$refs.video, this.options);

    this.player.on("pause", () => {
      this.isPaused = true;
    });

    this.player.on("play", () => {
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
  object-fit: cover;
  height: 100%;
  min-height: 100%;
}
.video__controls {
  padding: 1rem;
  position: absolute;
  z-index: 9999;
}
.video__container .video-js {
  height: 100%;
}
.video__container .vjs-tech {
  object-fit: cover;
  min-height: 100%;
}
</style>
