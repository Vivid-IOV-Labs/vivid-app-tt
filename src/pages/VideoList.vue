<template>
  <v-ons-page class="viewlist">
    <v-ons-toolbar>
      <div class="left">
        <head-logo></head-logo>
      </div>
      <div class="right">
        <head-menu></head-menu>
      </div>
    </v-ons-toolbar>
    <div class="scroller viewlist__content">
      <div class="page__title__background">
        <h3 class="page__title">Latest Videos</h3>
      </div>
      <v-ons-list modifier="tappable">
        <v-ons-list-item
          v-for="media in getAll"
          :key="media.mediaID"
          @click="pushToVideo(media.mediaID)"
        >
          <div class="flex-center-y full-width">
            <div>
              <span>{{ media.details.title }}</span>
            </div>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
    <content-feed-dialog v-model="isContentFeedDialog"></content-feed-dialog>
  </v-ons-page>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import HeadLogo from "@/components/HeadLogo.vue";
import ContentFeedDialog from "@/components/dialogs/ContentFeedDialog.vue";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters, mapMutations } = createNamespacedHelpers(
  "media"
);
import webSocketService from "@/util/webSocketService.js";

export default {
  name: "VideoList",
  components: {
    HeadMenu,
    HeadLogo,
    ContentFeedDialog
  },
  data() {
    return {
      isContentFeedDialog: false
    };
  },
  created() {
    this.populateAll();
  },
  computed: {
    ...mapGetters(["getAll"])
  },
  methods: {
    ...mapActions(["populateAll"]),
    ...mapMutations(["add", "delete"]),
    pushToVideo(mediaID) {
      this.$router.push({ path: `viewvideo/${mediaID}` });
    },
    showContentFeedDialog() {
      this.isContentFeedDialog = true;
    }
  },
  mounted() {
    webSocketService.socket.on("media-added", async ({ data }) => {
      await this.add(data);
    });
    webSocketService.socket.on("media-deleted", async ({ data }) => {
      await this.delete(data);
    });
    this.showContentFeedDialog();
  }
};
</script>
<style lang="scss">
.viewlist {
  .viewlist__content {
    padding: 1rem;
  }
  .list {
    background: lighten($color: $dark-grey, $amount: 15);
  }
  .list-item {
    color: $white;
    border-bottom: solid;
    padding: 0;
    border-color: $dark-grey;
  }
}
.dialog-container {
  background-color: lighten($color: $dark-grey, $amount: 15);
  color: $white;
}
</style>
