<template>
  <v-ons-page>
    <div class="loading-page">
      <img class="loading-page__img" src="@/img/logopeerkat.png" />
      <h1 class="loading-page__title">PEERKAT</h1>
      <div id="google-signin-btn"></div>
      <v-ons-button @click="signIn" class="btn btn-default"
        >Sign In <v-ons-icon icon="fa-google"></v-ons-icon
      ></v-ons-button>
      <v-ons-button @click="loginTwitter" class="btn btn-default"
        >Sign In <v-ons-icon icon="fa-twitter"></v-ons-icon
      ></v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
/* eslint-disable no-undef */
import OnBoarding from "@/components/OnBoarding.vue";
import hello from "hellojs/dist/hello.all.js";
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
      await this.$store.dispatch("setUser", user);
      this.$emit("push-page", OnBoarding);
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
    },
    twws() {
      hello.init(
        {
          twitter: process.env.VUE_APP_TWITTER_API_SECRET
        },
        {
          scope: "email",
          redirect_uri: "http://localhost:8080"
        }
      );
    },
    loginTwitter() {
      hello("twitter").login();
      // Listen to signin requests
      hello.on("auth.login", r => {
        // Get Profile
        hello(r.network)
          .api("/me")
          .then(p => {
            window.console.log(p); // output user information
          });
      });
    }
  },
  created() {},
  async mounted() {
    this.twws();
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
