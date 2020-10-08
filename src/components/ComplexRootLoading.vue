<template>
  <v-ons-page>
    <div class="loading-page">
      <img class="loading-page__img" src="@/img/logopeerkat.png" />
      <h1 class="loading-page__title">PEERKAT</h1>
      <div id="google-signin-btn"></div>
      <v-ons-button @click="signIn" class="btn btn-default"
        >Sign In <v-ons-icon icon="fa-google"></v-ons-icon
      ></v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
import Profile from "./Profile.vue";
/* eslint-disable no-undef */

const getPosition = options => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
};

var GoogleAuth;
var scope = "profile email";
var clientId = process.env.VUE_APP_GOOGLE_ID;

export default {
  name: "RootLoading",
  data() {
    return {
      GoogleAuth,
      scope,
      clientId
    };
  },
  methods: {
    async onSignIn(payload) {
      const user = payload.getBasicProfile();
      // eslint-disable-next-line no-debugger
      debugger;
      await this.$store.dispatch("setUser", user);
      this.$emit("push-page", Profile);
    },
    signIn() {
      this.handleAuthClick();
    },
    signOut() {
      this.revokeAccess();
    },
    async getLocation() {
      const options = {
        timeout: 1000,
        maximumAge: 10000,
        enableHighAccuracy: true
      };
      try {
        const position = await getPosition(options);
        this.$store.dispatch("setPosition", position);
      } catch (err) {
        console.error(err.message);
      }
    },
    handleClientLoad() {
      gapi.load("client:auth2", this.initClient);
    },
    initClient() {
      gapi.client
        .init({
          clientId,
          scope
        })
        .then(() => {
          this.GoogleAuth = gapi.auth2.getAuthInstance();

          this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);

          const user = this.GoogleAuth.currentUser.get();
          if (this.GoogleAuth.isSignedIn.get()) {
            this.onSignIn(user);
          }
        });
    },
    handleAuthClick() {
      if (this.GoogleAuth.isSignedIn.get()) {
        this.GoogleAuth.signOut();
      } else {
        this.GoogleAuth.signIn();
      }
    },
    revokeAccess() {
      this.GoogleAuth.disconnect();
    },
    setSigninStatus() {
      var user = this.GoogleAuth.currentUser.get();
      var isAuthorized = user.hasGrantedScopes(scope);
      if (isAuthorized) {
        console.log("signed in");
      } else {
        console.log("sign out");
      }
    },
    updateSigninStatus() {
      this.setSigninStatus();
    }
  },
  created() {},
  async mounted() {
    await this.getLocation();
    window.addEventListener("google-loaded", this.handleClientLoad);
  }
};
</script>
<style>
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background: #000;
}
.loading-page .loading-page__title {
  font-weight: bolder;
  color: #16dbdb;
  font-size: 2.3rem;
  margin: 0.6rem 0;
}
.loading-page .loading-page__img {
  width: 40%;
}
</style>
