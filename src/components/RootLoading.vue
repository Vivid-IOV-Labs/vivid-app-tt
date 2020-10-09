<template>
  <v-ons-page>
    <div class="loading-page">
      <img class="loading-page__img" src="@/img/logopeerkat.png" />
      <h1 class="loading-page__title">PEERKAT</h1>
      <v-ons-button @click="handleAuthClick" class="btn btn--login"
        >Sign In <v-ons-icon icon="fa-google"></v-ons-icon
      ></v-ons-button>
      <v-ons-button @click="loginTwitter" class="btn btn--login"
        >Sign In <v-ons-icon icon="fa-twitter"></v-ons-icon
      ></v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
/* eslint-disable no-undef */
var GoogleAuth;
const scope = "profile email";
const googleClientID = process.env.VUE_APP_GOOGLE_ID;
const twitterClientID = process.env.VUE_APP_TWITTER_API_KEY;
const appUrl = process.env.VUE_APP_APP_URL;
// window.location.href returns the href (URL) of the current page
// window.location.hostname returns the domain name of the web host
// window.location.pathname returns the path and filename of the current page
// window.location.protocol
const twitterCallback = `${appUrl}/login`;
import OnBoarding from "@/components/OnBoarding.vue";
import hello from "hellojs/dist/hello.all.js";
const getPosition = options => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
};
export default {
  name: "RootLoading",
  data() {
    return {
      GoogleAuth,
      scope,
      googleClientID
    };
  },
  methods: {
    async onSignIn(user) {
      const profile = user.getBasicProfile();
      const basicUser = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        avatar: profile.getImageUrl(),
        location: ""
      };
      await this.$store.dispatch("setUser", basicUser);
      this.$emit("push-page", OnBoarding);
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
          clientId: googleClientID,
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
        this.onSignIn(user);
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
          twitter: twitterClientID
        },
        {
          scope: "email",
          redirect_uri: twitterCallback
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
            console.log(p);
            this.createUserFromTwitter(p); // output user information
          })
          .catch(console.log);
      });
    },
    async createUserFromTwitter(user) {
      const profile = {
        twitterID: user.id,
        name: user.name,
        email: user.email,
        loaction: user.loaction,
        avatar: user.profile_image_url
      };
      await this.$store.dispatch("setUser", profile);
      this.$emit("push-page", OnBoarding);
    }
  },
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
.btn--login {
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.2rem;
  padding: 0.8rem 1rem;
}
</style>
