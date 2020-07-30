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
    <div>
      <base-video :options="videoOptions"></base-video>
    </div>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import BaseVideo from "@/components/BaseVideo.vue";

export default {
  name: "Streamer",
  data() {
    return {
      videoOptions: {
        autoplay: false,
        controls: false,
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
