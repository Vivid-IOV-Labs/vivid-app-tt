<template>
  <v-ons-page id="Streamer">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">Streaming</span>
      </div>
    </v-ons-toolbar>
    <div style="height: 100%;display: flex;flex-direction: column;">
      <base-video :options="videoOptions"></base-video>
    </div>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import BaseVideo from "@/components/BaseVideo.vue";
/**
ffmpeg -re -i https://eric-test-livepeer.s3.amazonaws.com/bbb_1080p.mp4 -c:v copy -c:a copy -f flv rtmp://chi-origin.livepeer.live/bf2d-r2cd-ul0i/mmcb+bbb_test
 
 https://v0chi.lp-distro.com/mmcb%2Bbbb_test/index.m3u8

 https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
 */
export default {
  name: "Streamer",
  data() {
    return {
      videoOptions: {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: "https://v0chi.lp-distro.com/mmcb%2Bbbb_test/index.m3u8",
            type: "application/x-mpegURL"
          }
        ]
      }
    };
  },
  components: {
    BaseVideo
  }
};
</script>
