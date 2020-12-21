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
      <div v-if="getHighlighted.length">
        <div class="page__title__background">
          <h3 class="page__title">Thundercore Introduction</h3>
        </div>
        <v-ons-list modifier="tappable">
          <v-ons-list-item
            v-for="media in getHighlighted"
            :key="media.mediaID"
            @click="pushToVideo(media.mediaID)"
          >
            <div class="flex-center-y full-width medialist__item ">
              <div class="px-2">
                {{ media.details.title }}
              </div>
              <base-icon class="ml-auto" name="angle-right"></base-icon>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </div>
      <div class="page__title__background">
        <h3 class="page__title">Latest Videos</h3>
      </div>
      <v-ons-list modifier="tappable">
        <v-ons-list-item
          v-for="media in getLatests"
          :key="media.mediaID"
          @click="pushToVideo(media.mediaID)"
        >
          <div class="flex-center-y full-width medialist__item ">
            <div class="px-2">
              {{ media.details.title }}
            </div>
            <base-icon class="ml-auto" name="angle-right"></base-icon>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
    <v-ons-bottom-toolbar>
      <div class="flex justify-center">
        <v-ons-toolbar-button @click="copyTwitterLink" class="btn--large">
          <input
            type="hidden"
            id="twitter-link"
            value="https://twitter.com/PeerkatLive"
          />
          <base-icon class="btn__icon--white" name="twitter"></base-icon>
        </v-ons-toolbar-button>
        <v-ons-toolbar-button @click="copyTelegramGroup" class="btn--large">
          <input
            type="hidden"
            id="telegram-group"
            value="https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw"
          />
          <base-icon class="btn__icon--white" name="telegram"></base-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-bottom-toolbar>
    <content-feed-dialog v-model="isContentFeedDialog"></content-feed-dialog>
  </v-ons-page>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import HeadLogo from "@/components/HeadLogo.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import ContentFeedDialog from "@/components/dialogs/ContentFeedDialog.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import webSocketService from "@/util/webSocketService.js";

export default {
  name: "VideoList",
  components: {
    HeadMenu,
    HeadLogo,
    BaseIcon,
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
    ...mapGetters("media", ["getLatests", "getHighlighted"]),
    ...mapGetters("user", ["getInterestsSubmitted"])
  },
  methods: {
    ...mapActions("media", ["populateAll"]),
    ...mapMutations("media", ["add", "delete", "setTotalTip"]),
    pushToVideo(mediaID) {
      this.$router.push({ path: `viewvideo/${mediaID}` });
    },
    showContentFeedDialog() {
      this.isContentFeedDialog = true;
    },
    copyTextValue(selector) {
      let testingCodeToCopy = document.querySelector(selector);
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      testingCodeToCopy.setSelectionRange(0, 99999); /* For mobile devices */

      try {
        document.execCommand("copy");
        this.$ons.notification.toast("Copied successfully!", { timeout: 2000 });
      } catch (err) {
        this.$ons.notification.toast("Oops, unable to copy ", {
          timeout: 2000
        });
      }
      /* unselect the range */
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    copyTelegramGroup() {
      this.copyTextValue("#telegram-group");
    },
    copyTwitterLink() {
      this.copyTextValue("#twitter-link");
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
    if (!this.getInterestsSubmitted) {
      this.showContentFeedDialog();
    }
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
  .medialist__item {
    border-bottom: solid 2px $dark-grey;
    padding: 1.2rem 0.2rem;
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
