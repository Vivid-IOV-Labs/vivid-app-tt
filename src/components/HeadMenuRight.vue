<template>
  <div>
    <v-ons-toolbar-button style="padding:0 0 0 0.2rem" @click="showPopover">
      <strong style="font-size:1.2rem">@PEERKATLIVE</strong>
    </v-ons-toolbar-button>
    <v-ons-popover
      cancelable
      :visible.sync="popoverVisible"
      :target="popoverTarget"
      direction="down"
      :cover-target="coverTarget"
    >
      <v-ons-list class="text-center p-2">
        <!-- <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="#"
            @click.prevent="toProfile('Privacy Policy')"
          >
            My Account
          </a>
        </v-ons-list-item> -->
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/peerkat-terms"
            @click="trackLink('User Terms')"
          >
            Terms of Use
          </a>
        </v-ons-list-item>
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/privacy"
            @click="trackLink('Privacy Policy')"
          >
            Privacy Notice
          </a>
        </v-ons-list-item>
        <v-ons-list-item class="text-center"
          ><span class="menu__link">
            <h6 class="mt-2 mb-2">
              Search for us at @PeerkatLive <br />
              on Twitter and Telegram!
            </h6>
            <hr class="hr-space" />
            <a
              class="btn--large ml-2 btn--primary"
              href="#"
              @click.prevent="copyTwitterLink"
            >
              <base-icon class="btn__icon--white" name="twitter"></base-icon>
            </a>
            <a
              class="btn--large ml-2 btn--primary"
              href="#"
              @click.prevent="copyTelegramGroup"
            >
              <base-icon class="btn__icon--white" name="telegram"></base-icon>
            </a>
          </span>
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
    toProfile() {
      this.popoverVisible = false;
      this.$router.push({ path: "profile" });
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
  font-weight: bolder;
}
.menu__link:last,
.menu__link:first {
  border: none !important;
}
</style>
