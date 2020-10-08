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
      <v-ons-card v-if="profile">
        <img class="profile__avatar" :src="profile.avatar" />
        <div class="title text-center">
          {{ profile.name }}
        </div>
        <div class="content">
          <v-ons-list class="profile__details">
            <v-ons-list-item>
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
              <span class="left">PayId</span>
              <span class="right">#tag, #tag, #tag</span>
            </v-ons-list-item>
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
            <v-ons-button class="btn btn--profile" @click="showJoinDialog()">
              Balance
              <img style="height: 16px;" src="../assets/payid.png" alt />
            </v-ons-button>
            <v-ons-button class="btn btn--profile">
              Cancel <v-ons-icon class="btn__icon" icon="fa-times"></v-ons-icon>
            </v-ons-button>
            <v-ons-button class="btn btn--profile">
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
import OnBoarding from "@/components/OnBoarding.vue";

export default {
  name: "Profile",
  computed: {
    ...mapGetters({
      profile: "getUser"
    })
  },
  methods: {
    toOnboarding() {
      this.$emit("push-page", OnBoarding);
    }
  }
};
</script>
<style>
.profile__avatar {
  display: flex;
  width: 60%;
  border-radius: 50%;
  margin: 0 auto;
}
.btn--profile {
  background-color: #fff;
  border-color: #1d1d1b;
  border-width: 2px;
  color: #1d1d1b;
}
</style>
