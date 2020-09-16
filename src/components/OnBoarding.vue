<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <span>
          <img
            style="margin: 0 0.8rem"
            width="30"
            src="../img/logopeerkat.png"
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
      <!-- <div class="right">
        <v-ons-toolbar-button @click="showPopover">
          <v-ons-icon
            style="color:#fff"
            class="btn__icon"
            icon="fa-bars"
          ></v-ons-icon>
        </v-ons-toolbar-button>
        <v-ons-popover
          cancelable
          :visible.sync="popoverVisible"
          :target="popoverTarget"
          :direction="popoverDirection"
          :cover-target="coverTarget"
          style="z-index: 99999; text-align:center"
        >
          <h6 class="text-center">Peerkat <small>BETA</small></h6>
          <v-ons-list class="text-center">
            <v-ons-list-item class="text-center" modifier="tappable"
              >User Guide</v-ons-list-item
            >
            <v-ons-list-item class="text-center" modifier="tappable"
              >User Policy</v-ons-list-item
            >
            <v-ons-list-item class="text-center" modifier="tappable"
              >Report Bug</v-ons-list-item
            >
            <v-ons-list-item class="text-center" modifier="tappable"
              >Customer Support</v-ons-list-item
            >
          </v-ons-list>
          <div class="flex justify-center">
            <v-ons-button class="btn btn--default">
              <v-ons-icon class="btn__icon" icon="fa-twitter"></v-ons-icon>
            </v-ons-button>
            <v-ons-button class="btn btn--default">
              <v-ons-icon class="btn__icon" icon="fa-telegram"></v-ons-icon>
            </v-ons-button>
          </div>
          <small class="text-center"
            >© 2020 Peerkat. All rights reserved.
          </small>
        </v-ons-popover>
      </div> -->
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
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import HowToRequest from "@/components/onboarding/HowToRequest.vue";
import HowToGoLive from "@/components/onboarding/HowToGoLive.vue";
import HowToSee from "@/components/onboarding/HowToSee.vue";

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
      this.$emit("back-page");
    }
  }
};
</script>
<style>
.justify-center {
  justify-content: center;
}
.text-center {
  text-align: center!;
}
.list-item__center {
  justify-content: space-between;
}
.popover {
  padding: 1rem;
}
</style>
