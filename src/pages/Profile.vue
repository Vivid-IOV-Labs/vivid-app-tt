<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div>
        <head-logo></head-logo>
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="toEarnList">
          <base-icon class="btn__icon--primary" name="chevron-left"></base-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div class="profile-page">
      <div class="profile__avatar">
        <img src="@/assets/img/logopeerkat.png" />
      </div>
      <h3>Connect Twitter authentication for Peerkat</h3>
      <div style="align-items: center;" class="flex">
        <div class="mr-1">
          <p>Verify your Peerkat account with Twitter</p>
        </div>
        <v-ons-switch
          style="margin-left:1rem"
          @change="twitterAuth"
          v-model="isAuthenticated"
        >
        </v-ons-switch>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import { trackEvent } from "@/util/analytics";
import HeadLogo from "@/components/HeadLogo.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import { mapGetters } from "vuex";
import TwitterAuthService from "@/services/TwitterAuthService";
export default {
  name: "Profile",
  components: {
    HeadLogo,
    BaseIcon
  },
  data() {
    return { isAuthenticated: false };
  },
  computed: {
    ...mapGetters("smartcontract", ["getUserWalletAddress"])
  },
  methods: {
    trackLink(link) {
      trackEvent({
        category: "Profile View",
        action: "select-menu-item",
        label: link
      });
    },
    toEarnList() {
      this.trackLink("earn-page");
      this.$router.push({ path: "earnvideolist" });
    },
    async loginTwitter() {
      const userWalletAddress = this.getUserWalletAddress;
      await TwitterAuthService.authenticate(userWalletAddress);
    },
    twitterAuth(event) {
      console.log(event);
      if (this.isAuthenticated) {
        //await TwitterAuthService.logout(userWalletAddress);
      } else {
        this.loginTwitter();
      }
    }
  }
};
</script>
<style lang="scss">
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background: $black;
  .profile__avatar {
    display: flex;
    border-radius: 50%;
    margin: 0 auto 3rem;
  }
}
</style>
