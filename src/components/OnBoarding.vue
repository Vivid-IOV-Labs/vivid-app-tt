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
          <component v-bind:is="currentOnboarding"></component>
        </keep-alive>
      </v-ons-carousel-item>
    </v-ons-carousel>

    <v-ons-bottom-toolbar>
      <div class="onboarding-page__bottom">
        <v-ons-toolbar-button
          v-if="carouselIndex == onBoardingViews.length - 1"
          @click="endOnBoarding"
        >
          ENTER PLANET PEERKAT
          <base-icon class="btn__icon" name="angle-right"></base-icon>
        </v-ons-toolbar-button>
        <div v-else>
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
import Home from "@/components/Home.vue";

export default {
  name: "OnBoarding",
  components: { HeadLogo, HowToRequest, HowToGoLive, HowToSee },
  data() {
    return {
      onBoarding: false,
      carouselIndex: 0,
      onBoardingViews: ["HowToRequest", "HowToGoLive", "HowToSee"]
    };
  },
  computed: {
    currentOnboarding() {
      return this.onBoardingViews[this.carouselIndex];
    }
  },
  methods: {
    endOnBoarding() {
      this.$emit("push-page", Home);
    }
  }
};
</script>
<style>
.list-item__center {
  justify-content: space-between;
}
</style>
