<template>
  <v-ons-page>
    <div class="loading-page">
      <h1 class="loading-page__title">PEERKAT</h1>
      <v-ons-button
        :disabled="isLoading"
        id="google-auth"
        class="btn btn--login"
        >Sign In Google
      </v-ons-button>
      <v-ons-button
        :disabled="isLoading"
        @click="loginTwitter"
        class="btn btn--login"
        >Sign In Twit
      </v-ons-button>
      <v-ons-progress-circular
        v-if="isLoading"
        indeterminate
      ></v-ons-progress-circular>
    </div>
  </v-ons-page>
</template>

<script>
/* eslint-disable no-undef */
const scope = "profile email";
const googleClientID = process.env.VUE_APP_GOOGLE_ID;
const twitterClientID = process.env.VUE_APP_TWITTER_API_KEY;
const appUrl = process.env.VUE_APP_APP_URL;

const twitterCallback = `${appUrl}/login`;

import hello from "hellojs/dist/hello.all.js";

export default {
  name: "RootLoading",
  data() {
    return {
      scope,
      googleClientID,
      isLoading: false
    };
  },
  methods: {
    async createUserFromGoogle(user) {
      const profile = user.getBasicProfile();
      const basicUser = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        avatar: profile.getImageUrl(),
        location: ""
      };
      await this.$store.dispatch("setUser", basicUser);
      this.isLoading = false;

      this.$router.push({ path: `profile` });
    },
    loadGoogleAuth() {
      let auth2;
      const attachSignin = element => {
        auth2.attachClickHandler(
          element,
          {},
          googleUser => {
            this.createUserFromGoogle(googleUser);
          },
          error => {
            console.log(JSON.stringify(error, undefined, 2));
          }
        );
      };
      gapi.load("auth2", () => {
        auth2 = gapi.auth2.init({
          clientId: googleClientID,
          scope,
          cookiepolicy: "single_host_origin"
        });
        attachSignin(document.getElementById("google-auth"));
      });
    },
    loadTwitterAuth() {
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
      this.isLoading = true;

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
      console.log(profile);
      // await this.$store.dispatch("setUser", profile);
      this.isLoading = false;

      this.$router.push({ path: `profile` });
    }
  },
  async mounted() {
    this.loadTwitterAuth();
    // this.loadGoogleAuth();
    // await this.getLocation();
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
