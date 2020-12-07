<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <head-logo></head-logo>
      </div>
      <div class="center">
        Welcome To Peerkat
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="endOnBoarding">
          Skip
          <base-icon class="btn__icon" name="angle-right"></base-icon>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <v-ons-carousel
      fullscreen
      swipeable
      auto-scroll
      overscrollable
      :index.sync="carouselIndex"
    >
      <v-ons-carousel-item v-for="(value, key) in onBoardingViews" :key="key">
        <keep-alive>
          <component
            v-bind:is="currentOnboarding"
            :end-on-boarding="endOnBoarding"
          ></component>
        </keep-alive>
      </v-ons-carousel-item>
    </v-ons-carousel>
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'Geolocation Permission'"
      :visible.sync="allowGeolocationMessage"
      :footer="{
        Ok: pushToHome
      }"
    >
      you need to turn your geolocation on in order to use the app
    </v-ons-alert-dialog>
    <v-ons-bottom-toolbar>
      <div class="onboarding-page__bottom">
        <div>
          <span
            :index="dotIndex - 1"
            v-for="dotIndex in onBoardingViews.length"
            :key="dotIndex"
            @click="carouselIndex = dotIndex - 1"
          >
            {{ carouselIndex === dotIndex - 1 ? "\u25CF" : "\u25CB" }}
          </span>
        </div>
      </div>
    </v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import HeadLogo from "@/components/HeadLogo.vue";

import HowToRequest from "@/components/onboarding/HowToRequest.vue";
import HowToGoLive from "@/components/onboarding/HowToGoLive.vue";
import HowToSee from "@/components/onboarding/HowToSee.vue";
import EnterPeerkat from "@/components/onboarding/EnterPeerkat.vue";
const getPosition = options => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
};
import devLog from "@/util/devlog.js";

export default {
  name: "OnBoarding",
  components: { HeadLogo, HowToRequest, HowToGoLive, HowToSee, EnterPeerkat },
  data() {
    return {
      onBoarding: false,
      carouselIndex: 0,
      allowGeolocationMessage: false,
      onBoardingViews: [
        "HowToRequest",
        "HowToGoLive",
        "HowToSee",
        "EnterPeerkat"
      ]
    };
  },
  computed: {
    currentOnboarding() {
      return this.onBoardingViews[this.carouselIndex];
    }
  },
  methods: {
    async getLocation() {
      const options = {
        timeout: 1000,
        maximumAge: 10000,
        enableHighAccuracy: true
      };
      return await getPosition(options);
    },
    pushToHome() {
      this.allowGeolocationMessage = false;
      this.$router.push({ path: "home" });
    },
    async endOnBoarding() {
      try {
        const position = await this.getLocation();
        await this.$store.dispatch("requests/setPosition", position);
        this.pushToHome();
      } catch (err) {
        devLog(err);
        this.allowGeolocationMessage = true;
      }
    }
  }
};
</script>
<style lang="scss">
.list-item__center {
  justify-content: space-between;
}
</style>
