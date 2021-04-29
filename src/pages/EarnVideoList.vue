<template>
  <v-ons-page class="viewlist">
    <v-ons-toolbar>
      <div>
        <earn-head-logo></earn-head-logo>
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="pushBack">
          <base-icon class="btn__icon--primary" name="angle-left"></base-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div class="scroller viewlist__content">
      <div>
        <h3 class="page__title">EARN TT BY WATCHING THESE VIDEOS</h3>
      </div>
      <div class="page__title__background">
        <h3 class="page__title">EARN VIDEOS</h3>
      </div>
      <v-ons-list modifier="tappable">
        <v-ons-list-item
          v-for="media in getEarnLatests"
          :key="media.mediaID"
          @click="pushToVideo(media.mediaID)"
        >
          <earn-video-list-item :media="media"></earn-video-list-item>
        </v-ons-list-item>
      </v-ons-list>
      <div class="page__title__background">
        <h3 class="page__title">COMPLETED EARN VIDEOS</h3>
      </div>
      <v-ons-list modifier="tappable">
        <v-ons-list-item
          v-for="media in getEarnCompleted"
          :key="media.mediaID"
          @click="pushToVideo(media.mediaID)"
        >
          <earn-video-list-item :media="media"></earn-video-list-item>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-page>
</template>

<script>
import EarnHeadLogo from "@/components/EarnHeadLogo.vue";
import EarnVideoListItem from "@/components/EarnVideoListItem.vue";
import { mapGetters, mapActions } from "vuex";
import webSocketService from "@/util/webSocketService.js";
import { trackEvent } from "@/util/analytics";

export default {
  name: "VideoList",
  components: {
    EarnHeadLogo,
    EarnVideoListItem
  },
  computed: {
    ...mapGetters("media", ["getEarnLatests", "getEarnCompleted"])
  },
  created() {
    this.populateAll();
  },
  methods: {
    ...mapActions("media", ["populateAll", "add", "delete"]),
    pushBack() {
      this.$router.back();
    },
    pushToVideo(mediaID) {
      trackEvent({
        category: "Earn Video List View",
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
