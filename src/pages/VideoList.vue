<template>
  <v-ons-page class="viewlist">
    <v-ons-toolbar>
      <div>
        <head-logo></head-logo>
      </div>
      <div class="right">
        <head-menu></head-menu>
      </div>
    </v-ons-toolbar>
    <div class=" viewlist__content scroller">
      <div v-if="getHighlighteds.length">
        <div class="page__title__background">
          <h3 class="page__title">Top Videos</h3>
        </div>
        <media-slider
          @intersect="fetchMoreHighlighteds()"
          :medias="getHighlighteds"
          :total="getTotalHighlighteds"
        ></media-slider>
      </div>
      <div v-if="getCryptos.length">
        <div class="page__title__background">
          <h3 class="page__title">Crypto</h3>
        </div>
        <media-slider
          @intersect="fetchMore('crypto')"
          :medias="getCryptos"
          :total="getTotalCryptos"
        ></media-slider>
      </div>
      <div v-if="getGamings.length">
        <div class="page__title__background">
          <h3 class="page__title">Gaming</h3>
        </div>
        <media-slider
          @intersect="fetchMore('gaming')"
          :medias="getGamings"
          :total="getTotalGamings"
        ></media-slider>
      </div>
      <div v-if="getOthers.length">
        <div class="page__title__background">
          <h3 class="page__title">Other</h3>
        </div>
        <div class="horizontal-scroller scroller">
          <media-slider
            @intersect="fetchMore('other')"
            :medias="getOthers"
            :total="getTotalOthers"
          ></media-slider>
        </div>
      </div>
    </div>
    <content-feed-dialog v-model="isContentFeedDialog"></content-feed-dialog>
    <terms-agree-dialog v-model="isTermsAgreeDialog"></terms-agree-dialog>
  </v-ons-page>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import HeadLogo from "@/components/HeadLogo.vue";
import MediaSlider from "@/components/MediaSlider.vue";
import ContentFeedDialog from "@/components/dialogs/ContentFeedDialog.vue";
import TermsAgreeDialog from "@/components/dialogs/TermsAgreeDialog.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import webSocketService from "@/util/webSocketService.js";
import { trackEvent } from "@/util/analytics";
import capitalize from "@/util/capitalize.js";

export default {
  components: {
    HeadMenu,
    HeadLogo,
    ContentFeedDialog,
    TermsAgreeDialog,
    MediaSlider
  },
  data() {
    return {
      isContentFeedDialog: false,
      isTermsAgreeDialog: false
    };
  },
  created() {
    this.populateAll();
  },
  computed: {
    ...mapGetters("media", [
      "getHighlighteds",
      "getCryptos",
      "getGamings",
      "getOthers",
      "getTotalHighlighteds",
      "getTotalCryptos",
      "getTotalGamings",
      "getTotalOthers"
    ]),
    ...mapGetters("user", ["getInterestsSubmitted", "getTermsAgreed"])
  },
  methods: {
    ...mapActions("media", [
      "populateAll",
      "add",
      "delete",
      "populateMore",
      "populateMoreHighlighteds"
    ]),
    ...mapMutations("media", ["setTotalTip", "addHighlighted"]),
    showContentFeedDialog() {
      this.isContentFeedDialog = true;
    },
    showTermsAgreeDialog() {
      this.isTermsAgreeDialog = true;
    },
    copyTextValue(selector, successText) {
      let testingCodeToCopy = document.querySelector(selector);
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      testingCodeToCopy.setSelectionRange(0, 99999); /* For mobile devices */

      try {
        document.execCommand("copy");

        this.$ons.notification.toast(successText, { timeout: 2000 });
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
      this.copyTextValue("#telegram-group", "Telegram copied successfully!");
      trackEvent({
        category: "Video List View",
        action: "copy-social",
        label: "telegram"
      });
    },
    copyTwitterLink() {
      this.copyTextValue("#twitter-link", "Twitter copied successfully!");
      trackEvent({
        category: "Video List View",
        action: "copy-social",
        label: "twitter"
      });
    },
    async fetchMore(category) {
      const capitaledCategory = capitalize(category);
      const getKeyTotal = `getTotal${capitaledCategory}s`;
      const getKeyFetched = `get${capitaledCategory}s`;
      const getFetched = this[getKeyFetched];
      const getTotal = this[getKeyTotal];
      if (getFetched.length < getTotal) {
        await this.populateMore(category);
      } else {
        return;
      }
    },
    async fetchMoreHighlighteds() {
      if (this.getHighlighteds.length < this.getTotalHighlighteds) {
        await this.populateMoreHighlighteds();
      } else {
        return;
      }
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
    if (!this.getTermsAgreed) {
      this.showTermsAgreeDialog();
    }
    if (!this.getInterestsSubmitted && this.getTermsAgreed) {
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
</style>
