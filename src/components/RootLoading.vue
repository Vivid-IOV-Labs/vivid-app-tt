<template>
  <v-ons-page>
    <div class="loading-page">
      <img class="loading-page__img" src="@/img/logopeerkat.png" />
      <h1 class="loading-page__title">PEERKAT</h1>
      <div id="google-signin-btn"></div>
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
const getPosition = options => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
};
export default {
  name: "RootLoading",
  data() {
    return {
      profile: null
    };
  },
  methods: {
    async onSignIn(user) {
      const profile = user.getBasicProfile();
      const basicUser = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        avatar: profile.getImageUrl()
      };
      await this.$store.dispatch("setUser", basicUser);
      this.$emit("push-page", OnBoarding);
    },
    signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        location.reload(true);
      });
    },
    renderGoogleLoginButton() {
      gapi.signin2.render("google-signin-btn", {
        onsuccess: this.onSignIn
      });
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
    twws() {
      hello.init(
        {
          twitter: "SV1vE3rmhNj2aYBMMloNlsXqu"
        },
        {
          scope: "email",
          redirect_uri: "http://peerkatlocal.live:8080/login"
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
    window.addEventListener("google-loaded", this.renderGoogleLoginButton);
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
