<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <head-logo></head-logo>
      </div>
      <div class="center">
        <head-search></head-search>
      </div>
      <div class="right">
        <head-menu @push-onboarding="pushToOnboarding"></head-menu>
      </div>
    </v-ons-toolbar>
    <keep-alive>
      <request-stream
        @push-broadcast="pushToBroadcaster"
        @push-stream="pushToStreamer"
        @push-page="pushToViewStreamPage"
        @push-supply="pushToSupplyStreamPage"
        @back-page="popViewPage"
      ></request-stream>
    </keep-alive>
    <v-ons-bottom-toolbar></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import RequestStream from "@/components/RequestStream.vue";

import HeadMenu from "@/components/HeadMenu.vue";
import HeadLogo from "@/components/HeadLogo.vue";
import HeadSearch from "@/components/HeadSearch.vue";
import OnBoarding from "@/components/OnBoarding.vue";

import ViewStream from "@/components/ViewStream.vue";
import SupplyStream from "@/components/SupplyStream.vue";
import Streamer from "@/components/Streamer.vue";
import Broadcaster from "@/components/Broadcaster.vue";

export default {
  name: "home",
  components: {
    RequestStream,
    HeadMenu,
    HeadLogo,
    HeadSearch
  },
  methods: {
    pushToOnboarding() {
      this.$emit("push-page", OnBoarding);
    },
    pushToViewStreamPage() {
      this.$emit("push-page", ViewStream);
    },
    pushToStreamer() {
      this.$emit("push-page", Streamer);
    },
    pushToBroadcaster() {
      this.$emit("push-page", Broadcaster);
    },
    pushToSupplyStreamPage() {
      this.$emit("push-page", SupplyStream);
    },
    popViewPage() {
      this.$emit("back-page");
    }
  }
};
</script>
