<template>
  <v-ons-page class="viewlist">
    <v-ons-toolbar>
      <div>
        <earn-head-logo></earn-head-logo>
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="pushBack">
          <base-icon class="btn__icon--primary" name="chevron-left"></base-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div class=" viewlist__content scroller">
      <div>
        <h3 v-if="getEarnLatests.length > 0" class="page__title">
          EARN TT BY WATCHING THESE VIDEOS
        </h3>
        <h3
          style="text-transform: uppercase;"
          v-if="getEarnLatests.length == 0"
          class="page__title"
        >
          You are up to date! Please check back later for new Peerkat Earn
          videos
        </h3>
      </div>
      <div v-if="getEarnLatests.length">
        <div class="page__title__background">
          <h3 class="page__title">EARN VIDEOS</h3>
        </div>
        <v-ons-list modifier="tappable">
          <v-ons-list-item v-for="media in getEarnLatests" :key="media.mediaID">
            <earn-video-list-item :media="media"></earn-video-list-item>
          </v-ons-list-item>
        </v-ons-list>
      </div>

      <div v-if="getEarnCompleted.length">
        <div class="page__title__background">
          <h3 class="page__title">COMPLETED EARN VIDEOS</h3>
        </div>
        <v-ons-list modifier="tappable">
          <v-ons-list-item
            v-for="media in getEarnCompleted"
            :key="media.mediaID"
          >
            <earn-video-list-item :media="media"></earn-video-list-item>
          </v-ons-list-item>
        </v-ons-list>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import EarnHeadLogo from "@/components/EarnHeadLogo.vue";
import EarnVideoListItem from "@/components/EarnVideoListItem.vue";
import { mapGetters, mapActions } from "vuex";
import webSocketService from "@/util/webSocketService.js";

export default {
  components: {
    EarnHeadLogo,
    EarnVideoListItem
  },
  computed: {
    ...mapGetters("media", ["getEarnLatests", "getEarnCompleted"])
  },
  created() {
    this.populateEarn();
  },
  methods: {
    ...mapActions("media", ["populateEarn", "add", "delete"]),
    pushBack() {
      this.$router.push({ path: "/videolist" });
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
      await this.delete(data[0]);
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
