<template>
  <div>
    <v-ons-toolbar-button style="padding:0 0 0 0.2rem" @click="showPopover">
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
    async copyTextValue(copyText, successText) {
      try {
        await clipboard.writeText(copyText);

        this.$ons.notification.toast(successText, {
          timeout: 2000
        });
      } catch (err) {
        this.$ons.notification.toast("Oops, unable to copy ", {
          timeout: 2000
        });
      }
    },
    copyTwitterLink() {
      this.copyTextValue(
        "https://twitter.com/PeerkatLive",
        "Twitter copied successfully!"
      );
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
