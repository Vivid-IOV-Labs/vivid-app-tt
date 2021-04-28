<template>
  <div>
    <v-ons-toolbar-button @click="toEarnList">
      <base-icon class="btn__icon--primary" name="dollar-sign"></base-icon>
    </v-ons-toolbar-button>
    <v-ons-popover
      cancelable
      :visible.sync="popoverVisible"
      :target="popoverTarget"
      direction="left"
      :cover-target="coverTarget"
    >
      <v-ons-list class="text-center p-2">
        <v-ons-list-item class="text-center" modifier="tappable">
          <a class="menu__link">
            <h6 class="mt-2 mb-2">
              Crypto or Gaming YouTubers <br />
              & Twitch streamers:
            </h6>
            <p>
              To become a Peerkat Content Partner send your YouTube/Twitch
              channel links to <strong>@PeerkatLive</strong> on Telegram or
              Twitter
            </p>
          </a>
        </v-ons-list-item>
        <!-- <v-ons-list-item class="text-center" modifier="tappable">
          <a class="menu__link" @click.prevent="toProfile">
            <strong>Pro</strong>
          </a>
        </v-ons-list-item> -->
      </v-ons-list>
    </v-ons-popover>
  </div>
</template>

<script>
import { trackEvent } from "@/util/analytics";
import * as clipboard from "clipboard-polyfill/text";

export default {
  name: "HeadMenu",
  data() {
    return {
      popoverVisible: false,
      popoverTarget: null,
      popoverDirection: "up",
      coverTarget: false
    };
  },
  methods: {
    toProfile() {
      this.popoverVisible = false;
      this.$router.push({ path: "profile" });
    },
    toEarnList() {
      this.trackLink("earn-page");
      this.$router.push({ path: "earnvideolist" });
    },
    trackLink(link) {
      trackEvent({
        category: "Video List View",
        action: "select-menu-item",
        label: link
      });
    },
    copyTextValueOld(copyText, successText) {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("value", copyText);
      input.setAttribute("type", "text");
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 99999); /* For mobile devices */

      try {
        document.execCommand("copy");

        this.$ons.notification.toast(successText, {
          timeout: 1000
        });
      } catch (err) {
        this.$ons.notification.toast(err, {
          timeout: 1000
        });
      }
      /* unselect the range */
      input.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    async copyTextValue(copyText, successText) {
      try {
        await clipboard.writeText(copyText);

        this.$ons.notification.toast(successText, {
          timeout: 1000
        });
      } catch (err) {
        this.copyTextValueOld(copyText, successText);
      }
    },
    copyMail() {
      this.copyTextValue("team@peerkat.live", "Email copied successfully!");
    }
  }
};
</script>
<style lang="scss">
.list-item__center {
  justify-content: space-between;
}
.menu__link {
  text-decoration: none;
  color: #222;
  display: block;
  width: 100%;
  height: 100%;
}
.menu__link:last {
  border: none !important;
}
</style>
