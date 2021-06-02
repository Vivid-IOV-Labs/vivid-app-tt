<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div>
        <div class="head_logo">
          <img
            class="head_logo__img"
            src="../assets/img/logopeerkat.png"
            alt="Peerkat Logo"
          />
        </div>
      </div>
      <div class="right">
        <v-ons-toolbar-button>
          <router-link to="/videolist">
            <base-icon
              class="btn__icon--primary"
              name="chevron-left"
            ></base-icon
          ></router-link>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <div class="profile-page">
      <div class="profile-page__main" v-if="getTwitterLinked">
        <div class="profile__avatar">
          <img :src="getTwitterProfile.photos[0].value" />
        </div>
        <h3>@{{ getTwitterProfile.username }}</h3>
        <v-ons-list class="profile__list">
          <v-ons-list-item class="profile__list__item ">
            <div class="text-center  center  flex-column flex-center-xy">
              <strong>TT WALLET ADDRESS</strong>
              <small style="width:180px" class="truncate"
                >{{ getUserWalletAddress.substring(0, 15) }}...
              </small>
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <div class="flex full-width mt-4">
          <div class="column-left flex-column flex-center-xy">
            <strong class="text-center text-small text-bold"
              >PEERKAT EARN TOTAL</strong
            >
            <div class="flex flex-column flex-center-xy mt-4">
              <div
                class="btn ml-2 btn--round-large btn--opacity-dark mb-2"
                style="font-size: 3.4rem; padding: 0.2rem 0 0 0.2rem; border:solid 2px #16dbdb;"
              >
                <base-icon
                  class="btn__icon"
                  style="stroke: #16dbdb;"
                  :fill="false"
                  name="thundercore"
                ></base-icon>
              </div>
              <p>{{ getRewardsEarned }} TT</p>
            </div>
          </div>
          <div class="column-right flex-column flex-center-xy ml-auto">
            <strong class="text-center text-small text-bold"
              >YOUR TT WALLET TOTAL</strong
            >
            <div class="flex flex-column flex-center-xy mt-4">
              <div
                class="btn ml-2 btn--round-large btn--opacity-dark mb-2"
                style="font-size: 3.4rem; padding: 0.2rem 0 0 0.2rem; border:solid 2px #FFE81C;"
              >
                <base-icon
                  class="btn__icon"
                  style="stroke: #FFE81C;"
                  :fill="false"
                  name="thundercore"
                ></base-icon>
              </div>
              <p>{{ getBalance.substring(0, 5) }}... TT</p>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-page__main" v-if="!getTwitterLinked">
        <div style="border:none" class="profile__avatar">
          <img src="@/assets/img/logopeerkat.png" />
        </div>
        <h3 class="text-center">Connect Twitter authentication for Peerkat</h3>
      </div>
      <div style="align-items: center; flex:1" class="flex">
        <div class="mr-1">
          <p class="text-center" v-if="!getTwitterLinked">
            Verify your Peerkat account with Twitter
          </p>
          <p class="text-center" v-else>
            Disconnect your Twitter account from Peerkat
          </p>
        </div>
        <v-ons-switch
          ref="switch"
          :disabled="isAuthenticating || isDisconnecting"
          style="margin-left:1rem"
          v-model="isChecked"
          @change="onChange"
        >
        </v-ons-switch>
      </div>
    </div>

    <disconnect-twitter-dialog
      :on-cancel="onCancel"
      :on-confirm="disconnectTwitterProfile"
      v-model="disconnectTwitterConfirm"
    ></disconnect-twitter-dialog>
    <twitter-already-in-use-dialog
      v-model="isTwitterAlreadyInUse"
    ></twitter-already-in-use-dialog>
  </v-ons-page>
</template>

<script>
import { trackEvent } from "@/util/analytics";
import BaseIcon from "@/components/BaseIcon.vue";

import DisconnectTwitterDialog from "@/components/dialogs/DisconnectTwitterDialog.vue";
import TwitterAlreadyInUseDialog from "@/components/dialogs/TwitterAlreadyInUseDialog.vue";
import webSocketService from "@/util/webSocketService.js";

import TwitterAuthService from "@/services/TwitterAuthService";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Profile",
  components: {
    BaseIcon,
    DisconnectTwitterDialog,
    TwitterAlreadyInUseDialog
  },
  data() {
    return {
      isAuthenticating: false,
      isChecked: false,
      isDisconnecting: false,
      disconnectTwitterConfirm: false
    };
  },
  computed: {
    ...mapGetters("smartcontract", ["getUserWalletAddress", "getBalance"]),
    ...mapGetters("user", [
      "getTwitterLinked",
      "getTwitterProfile",
      "getRewardsEarned"
    ]),
    isTwitterAlreadyInUse() {
      return this.$route.params.status === "failed";
    }
  },
  methods: {
    ...mapActions("user", ["disconnectTwitter"]),
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
      this.isAuthenticating = true;
      const userWalletAddress = this.getUserWalletAddress;
      await TwitterAuthService.authenticate(userWalletAddress);
    },
    async disconnectTwitterProfile() {
      this.isDisconnecting = true;
      const userWalletAddress = this.getUserWalletAddress;
      await this.disconnectTwitter(userWalletAddress);
      this.isDisconnecting = false;
    },
    onCancel() {
      this.isChecked = this.getTwitterLinked;
    },
    onChange(event) {
      if (event.isInteractive) {
        if (this.getTwitterLinked) {
          this.disconnectTwitterConfirm = true;
        } else {
          this.loginTwitter();
        }
      }
    }
  },
  mounted() {
    this.isChecked = this.getTwitterLinked;
    webSocketService.socket.on("twitter-profile-already-exists", () => {
      this.isTwitterAlreadyInUse = false;
    });
  }
};
</script>
<style lang="scss">
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem;
  flex-direction: column;
  background: $black;
  .profile-page__main {
    display: flex;
    flex-direction: column;
    width: 80%;
    align-items: center;
    justify-content: center;
    flex: 2;
    padding-top: 1rem;
  }
  .profile__avatar {
    border-radius: 50%;
    margin: 1rem auto 0rem;
    width: 66px;
    overflow: hidden;
    height: 66px;
    border: solid 1px $azure;
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
  .profile__list {
    background: $black;
    width: 100%;
    padding-top: 1rem;
  }
  .profile__list__item {
    background: $black;
    width: 100%;
    color: $white;
    padding: 0;
  }
  .column-left {
    padding: 1rem 1rem 0 0;
  }
  .column-right {
    padding: 1rem 0 0 1rem;
  }
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
