<template>
  <div>
    <v-ons-toolbar-button style="padding:0 0 0 0.2rem" @click="showPopover">
      <strong style="font-size:1.2rem"
        >@PEERKATLIVE <span class="text-azure">EARN</span></strong
      >
    </v-ons-toolbar-button>
    <v-ons-popover
      cancelable
      :visible.sync="popoverVisible"
      :target="popoverTarget"
      direction="down"
      :cover-target="coverTarget"
    >
      <v-ons-list class="text-center p-2">
        <v-ons-list-item class="text-center"
          ><span class="menu__link">
            <h6 class="mt-2 mb-2">
              Search for us at @PeerkatLive <br />
              on Twitter and Telegram!
            </h6>
            <p>
              <small class="mt-2 mb-4">
                <i>Copy the handle by clicking on the buttons below:</i>
              </small>
            </p>

            <v-ons-button
              @click="copyTwitterLink"
              class="btn--large  btn--primary"
            >
              <base-icon class="btn__icon--white" name="twitter"></base-icon>
            </v-ons-button>
            <v-ons-button
              @click="copyTelegramGroup"
              class="btn--large ml-2 btn--primary"
            >
              <base-icon class="btn__icon--white" name="telegram"></base-icon>
            </v-ons-button>
          </span>
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
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/privacy"
            @click="trackLink('Privacy Policy')"
          >
            Privacy Policy
          </a>
        </v-ons-list-item>
      </v-ons-list>
      <div class="text-center mt-4 p-1 ">
        <small>© 2021 Peerkat. All rights reserved. </small>
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
    },
    copyTelegramGroup() {
      this.copyTextValue(
        "https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw",
        "Telegram copied successfully!"
      );
      trackEvent({
        category: "Video List View",
        action: "copy-social",
        label: "telegram"
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
