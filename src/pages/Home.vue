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
        <head-menu></head-menu>
      </div>
    </v-ons-toolbar>
    <keep-alive>
      <request-stream></request-stream>
    </keep-alive>
    <v-ons-bottom-toolbar></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import RequestStream from "@/components/RequestStream.vue";

import HeadMenu from "@/components/HeadMenu.vue";
import HeadLogo from "@/components/HeadLogo.vue";
import HeadSearch from "@/components/HeadSearch.vue";

export default {
  components: {
    RequestStream,
    HeadMenu,
    HeadLogo,
    HeadSearch
  }
};
</script>
