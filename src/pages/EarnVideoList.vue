<template>
  <v-ons-page class="viewlist">
    <v-ons-toolbar>
      <div>
        <head-logo></head-logo>
      </div>
      <div class="right">
        <v-ons-back-button>back</v-ons-back-button>
      </div>
    </v-ons-toolbar>
    <div class="scroller viewlist__content">
      <div>
        <h2>Watch the whole video to get a reward</h2>
      </div>
      <div v-if="getEarnHighlighted.length">
        <div class="page__title__background">
          <h3 class="page__title">Top Videos</h3>
        </div>
        <v-ons-list modifier="tappable">
          <v-ons-list-item
            v-for="media in getEarnHighlighted"
            :key="media.mediaID"
            @click="pushToVideo(media.mediaID)"
          >
            <video-list-item :media="media"></video-list-item>
          </v-ons-list-item>
        </v-ons-list>
      </div>
      <div class="page__title__background">
        <h3 class="page__title">Latest Videos</h3>
      </div>
      <v-ons-list modifier="tappable">
        <v-ons-list-item
          v-for="media in getEarnLatests"
          :key="media.mediaID"
          @click="pushToVideo(media.mediaID)"
        >
          <video-list-item :media="media"></video-list-item>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-page>
</template>

<script>
import HeadLogo from "@/components/HeadLogo.vue";
import VideoListItem from "@/components/VideoListItem.vue";
import { mapGetters } from "vuex";
import webSocketService from "@/util/webSocketService.js";
import { trackEvent } from "@/util/analytics";

export default {
  name: "VideoList",
  components: {
    HeadLogo,
    VideoListItem
  },
  computed: {
    ...mapGetters("media", ["getEarnLatests", "getEarnHighlighted"])
  },
  methods: {
    pushToVideo(mediaID) {
      trackEvent({
        category: "Video List View",
        action: "select-video",
        label: "MediaId:" + this.mediaID
      });
      this.$router.push({ path: `earnviewvideo/${mediaID}` });
    }
  },
  watch: {
    getTermsAgreed(newValue) {
      if (newValue) {
        if (!this.getInterestsSubmitted) {
          this.showContentFeedDialog();
        }
      }
    }
  },
  mounted() {
    webSocketService.socket.on("media-added", async ({ data }) => {
      await this.add(data);
    });
    webSocketService.socket.on("media-deleted", async ({ data }) => {
      await this.delete(data);
    });
    webSocketService.socket.on("media-updated-tip", async ({ data }) => {
      const { totalTips, mediaID } = data;
      this.setTotalTip({ mediaID, totalTips });
    });
  }
};
</script>
<style lang="scss">
.viewlist {
  .viewlist__content {
    padding: 1rem;
  }
  .list {
    padding: 0;
    margin: 0;
    background: lighten($color: $dark-grey, $amount: 15);
  }

  .list-item:last-child .medialist__item {
    border-bottom: none;
  }
  .list-item {
    color: $white;
    padding: 0;
    margin: 0;
  }
  .list-item__center {
    padding: 0;
    margin: 0;
    background-image: none;
    border: none;
  }
}
.dialog-container {
  background-color: lighten($color: $dark-grey, $amount: 15);
  color: $white;
}
</style>
