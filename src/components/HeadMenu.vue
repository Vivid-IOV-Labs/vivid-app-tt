<template>
  <div>
    <v-ons-toolbar-button @click="showPopover">
      <base-icon class="btn__icon--white" name="info-circle"></base-icon>
    </v-ons-toolbar-button>
    <v-ons-popover
      cancelable
      :visible.sync="popoverVisible"
      :target="popoverTarget"
      direction="left"
      :cover-target="coverTarget"
    >
      <h6 class="text-center">Peerkat <small>BETA</small></h6>
      <v-ons-list class="text-center p-2">
        <!-- <v-ons-list-item class="text-center" modifier="tappable"
          ><a class="menu__link" href="#" @click="toOnboarding">
            User Guide
          </a>
        </v-ons-list-item> -->
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/peerkat-terms"
            @click="trackLink('User Terms')"
            arget="_blank"
            rel="noopener noreferrer"
          >
            User Terms
          </a>
        </v-ons-list-item>
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="mailto:team@peerkat.live?subject=Report Bug"
            arget="_blank"
            rel="noopener noreferrer"
          >
            Report Bug
          </a></v-ons-list-item
        >
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="mailto:team@peerkat.live?subject=Customer Support"
            arget="_blank"
            rel="noopener noreferrer"
          >
            Customer Support
          </a></v-ons-list-item
        >
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="mailto:team@peerkat.live?subject=Register interest in becoming a Peerkat content creator"
            arget="_blank"
            rel="noopener noreferrer"
          >
            Become a creator
          </a></v-ons-list-item
        >
      </v-ons-list>
      <div class="text-center p-1 ">
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
