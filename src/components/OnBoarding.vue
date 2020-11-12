<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <span>
          <img
            style="margin: 0 0.8rem"
            width="30"
            src="../assets/img/logopeerkat.png"
            alt=""
          />
          <span
            style="    color: #999;
    font-size: 0.8rem;
    font-weight: 700;"
            >BETA</span
          >
        </span>
      </div>
      <div class="center">
        Welcome To Peerkat
      </div>
      <div class="right">
        <v-ons-toolbar-button style="color:#FFF" @click="endOnBoarding">
          Skip
          <v-ons-icon
            style="color:#fff"
            class="btn__icon"
            icon="fa-angle-right"
          ></v-ons-icon>
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
    <div :style="dots">
      <button
        v-if="carouselIndex == onBoardingViews.length - 1"
        class="btn btn--large btn--request"
        style="margin-bottom:8px"
        @click="endOnBoarding"
      >
        ENTER PLANET PEERKAT
      </button>
      <div v-else>
        <span
          :index="dotIndex - 1"
          v-for="dotIndex in onBoardingViews.length"
          :key="dotIndex"
          style="cursor: pointer"
          @click="carouselIndex = dotIndex - 1"
        >
          {{ carouselIndex === dotIndex - 1 ? "\u25CF" : "\u25CB" }}
        </span>
      </div>
    </div>
    <v-ons-bottom-toolbar></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import HowToRequest from "@/components/onboarding/HowToRequest.vue";
import HowToGoLive from "@/components/onboarding/HowToGoLive.vue";
import HowToSee from "@/components/onboarding/HowToSee.vue";
import Home from "@/components/Home.vue";

export default {
  name: "OnBoarding",
  components: {
    HowToRequest,
    HowToGoLive,
    HowToSee
  },
  data() {
    return {
      onBoarding: false,
      carouselIndex: 0,
      onBoardingViews: ["HowToRequest", "HowToGoLive", "HowToSee"],
      dots: {
        textAlign: "center",
        fontSize: "30px",
        color: "#222",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0
      }
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
