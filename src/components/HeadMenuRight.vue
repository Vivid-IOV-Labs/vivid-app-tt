<template>
  <div>
    <v-ons-toolbar-button @click="showPopover">
      <strong>@PeerkatLive</strong>
    </v-ons-toolbar-button>
    <v-ons-popover
      cancelable
      :visible.sync="popoverVisible"
      :target="popoverTarget"
      direction="down"
      :cover-target="coverTarget"
    >
      <v-ons-list class="text-center p-2">
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a class="menu__link" @click.prevent="copyTwitterLink">
            <h6 class="mt-2 mb-2">Search for us @PeerkatLive on twitter!</h6>
            <p class="mt-2 mb-4"><i>to copy the handle click here</i></p>
          </a>
          <input
            type="hidden"
            id="twitter-link"
            value="https://twitter.com/PeerkatLive"
          />
        </v-ons-list-item>
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/peerkat-terms"
            @click="trackLink('User Terms')"
          >
            User Terms
          </a>
        </v-ons-list-item>
      </v-ons-list>
      <div class="text-center mt-4 p-1 ">
        <small>© 2020 Peerkat. All rights reserved. </small>
      </div>
    </v-ons-popover>
  </div>
</template>

<script>
import { trackEvent } from "@/util/analytics";

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
    toOnboarding() {
      this.popoverVisible = false;
      this.$router.push({ path: "onboarding" });
    },
    showPopover(event, direction, coverTarget = false) {
      this.popoverTarget = event;
      this.popoverDirection = direction;
      this.coverTarget = coverTarget;
      this.popoverVisible = true;
      trackEvent({
        category: "Video List View",
        action: "click-menu"
      });
    },
    trackLink(link) {
      trackEvent({
        category: "Video List View",
        action: "select-menu-item",
        label: link
      });
    },
    copyMail() {
      let testingCodeToCopy = document.querySelector("#mailto");
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      testingCodeToCopy.setSelectionRange(0, 99999); /* For mobile devices */

      try {
        document.execCommand("copy");

        this.$ons.notification.toast("Email Copied successfully!", {
          timeout: 2000
        });
      } catch (err) {
        this.$ons.notification.toast("Oops, unable to copy ", {
          timeout: 2000
        });
      }
      /* unselect the range */
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    copyTextValue(selector, successText) {
      let testingCodeToCopy = document.querySelector(selector);
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      testingCodeToCopy.setSelectionRange(0, 99999); /* For mobile devices */

      try {
        document.execCommand("copy");

        this.$ons.notification.toast(successText, {
          timeout: 2000
        });
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
.menu__link:last,
.menu__link:first {
  border: none !important;
}
</style>
