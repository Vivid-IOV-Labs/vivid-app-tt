<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>
          <v-ons-icon
            icon="fa-arrow-left"
            style="color:#fff"
            class="btn__icon"
          />
        </v-ons-back-button>
      </div>
      <div class="center">
        Profile
      </div>
    </v-ons-toolbar>
    <div class="profile-page">
      <v-ons-button @click="loginTwitter" class="btn btn--primary">
        COnnect to Twitter
        <v-ons-icon class="btn__icon" icon="fa-check"></v-ons-icon>
      </v-ons-button>
      <v-ons-card v-if="profile">
        <img class="profile__avatar" :src="profile.avatar" />
        <div class="title text-center">
          <h2>
            {{ profile.name }} <small>{{ profile.email }}</small>
          </h2>
        </div>
        <div class="content">
          <v-ons-list class="profile__details">
            <v-ons-list-item v-if="profile.location">
              <span class="left">Location</span>
              <span class="right">{{ profile.location }}</span>
            </v-ons-list-item>
            <v-ons-list-item>
              <span class="left">Bio</span>
              <span class="right">Lorem ipsum doloret sit amet</span>
            </v-ons-list-item>
            <v-ons-list-item>
              <span class="left">HashTags</span>
              <span class="right">#tag, #tag, #tag</span>
            </v-ons-list-item>
          </v-ons-list>
          <v-ons-list style="padding:1rem; border:solid 1px ">
            <v-ons-list-item>
              <span class="left">Peerkat</span>
              <span class="right">@username</span>
            </v-ons-list-item>
            <v-ons-list-item>
              <span class="left">Telegram</span>
              <span class="right">@telegram</span>
            </v-ons-list-item>
            <v-ons-list-item
              ><span class="left">Twitter</span>
              <span class="right">@twitter</span></v-ons-list-item
            >
          </v-ons-list>

          <div
            style="display:flex; justify-content:space-between; margin-top:1rem"
          >
            <v-ons-button class="btn btn--primary">
              Balance
            </v-ons-button>
            <v-ons-button class="btn btn--primary">
              Cancel <v-ons-icon class="btn__icon" icon="fa-times"></v-ons-icon>
            </v-ons-button>
            <v-ons-button class="btn btn--primary">
              Save <v-ons-icon class="btn__icon" icon="fa-check"></v-ons-icon>
            </v-ons-button>
          </div>
        </div>
      </v-ons-card>
    </div>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
/* eslint-disable no-undef */
import { mapGetters } from "vuex";
const scope = "profile email";
const googleClientID = process.env.VUE_APP_GOOGLE_ID;
const twitterClientID = process.env.VUE_APP_TWITTER_API_KEY;
const appUrl = process.env.VUE_APP_APP_URL;

const twitterCallback = `${appUrl}/login`;

import hello from "hellojs/dist/hello.all.js";
export default {
  name: "Profile",
  data() {
    return {
      scope,
      googleClientID,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      profile: "user/getUser"
    })
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
      await this.$store.dispatch("user/setUser", profile);
    }
  },
  async mounted() {
    this.loadTwitterAuth();
    // this.loadGoogleAuth();
    // await this.getLocation();
  }
  // async createUserFromTwitter(
  //   user = {
  //     id: "Twitter_id",
  //     name: "Twitter_name",
  //     email: "Twitter_email",
  //     loaction: "Twitter_location",
  //     avatar: "Twitter_image"
  //   }
  // ) {
  //   const profile = {
  //     twitterID: user.id,
  //     name: user.name,
  //     email: user.email,
  //     loaction: user.loaction,
  //     avatar: user.profile_image_url
  //   };
  //   await this.$store.dispatch("user/setUser", profile);
  // }
};
</script>
<style>
.profile__avatar {
  display: flex;
  width: 60%;
  border-radius: 50%;
  margin: 0 auto;
}
</style>
