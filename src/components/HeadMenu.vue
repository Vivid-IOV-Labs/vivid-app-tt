<template>
  <div>
    <v-ons-toolbar-button @click="showPopover">
      <v-ons-icon class="btn__icon c-white" icon="fa-bars">
        <base-icon class="btn__icon--white" name="times"></base-icon>
      </v-ons-icon>
    </v-ons-toolbar-button>
    <v-ons-popover
      cancelable
      :visible.sync="popoverVisible"
      :target="popoverTarget"
      :direction="popoverDirection"
      :cover-target="coverTarget"
    >
      <h6 class="text-center">Peerkat <small>BETA</small></h6>
      <v-ons-list class="text-center">
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a class="menu__link" href="#" @click="toOnboarding">
            User Guide
          </a>
        </v-ons-list-item>
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/terms"
            target="_blank"
          >
            User Terms
          </a>
        </v-ons-list-item>
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="https://www.vividiov.com/privacy"
            target="_blank"
          >
            Privacy Policy
          </a></v-ons-list-item
        >
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="mailto:info@vividiov.com?subject=Report Bug"
            target="_blank"
          >
            Report Bug
          </a></v-ons-list-item
        >
        <v-ons-list-item class="text-center" modifier="tappable"
          ><a
            class="menu__link"
            href="mailto:info@vividiov.com?subject=Customer Support"
            target="_blank"
          >
            Customer Support
          </a></v-ons-list-item
        >
      </v-ons-list>
      <div class="flex justify-center">
        <a
          href="https://twitter.com/PeerkatLive"
          target="_blank"
          class="btn btn--default"
        >
          <v-ons-icon class="btn__icon" icon="fa-twitter"></v-ons-icon>
        </a>
        <a
          href="https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw"
          target="_blank"
          class="btn btn--default"
        >
          <v-ons-icon class="btn__icon" icon="fa-telegram"></v-ons-icon>
        </a>
      </div>
      <small class="text-center">© 2020 Peerkat. All rights reserved. </small>
    </v-ons-popover>
  </div>
</template>

<script>
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
      this.$emit("push-onboarding");
    },
    showPopover(event, direction, coverTarget = false) {
      this.popoverTarget = event;
      this.popoverDirection = direction;
      this.coverTarget = coverTarget;
      console.log(event);
      this.popoverVisible = true;
    }
  }
};
</script>
<style>
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
</style>
