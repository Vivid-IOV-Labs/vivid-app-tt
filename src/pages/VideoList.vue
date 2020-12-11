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
      <h3 class="page__title">Latest Videos</h3>
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
const { mapActions, mapGetters } = createNamespacedHelpers("media");

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
    pushToVideo(mediaID) {
      this.$router.push({ path: `viewvideo/${mediaID}` });
    },
    showContentFeedDialog() {
      this.isContentFeedDialog = true;
    }
  },
  mounted() {
    this.showContentFeedDialog();
  }
};
</script>
<style lang="scss" scoped>
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
</style>
