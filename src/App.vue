<template>
  <v-ons-navigator
    swipeable
    :page-stack="pageStack"
    @push-page="pageStack.push($event)"
    @back-page="pageStack.pop()"
    @reset-home-page="
      pageStack.pop();
      pageStack.push($event);
    "
  ></v-ons-navigator>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Source Code Pro");

@import "css/app.css";
body {
  font-family: "Source Code Pro";
}
</style>

<script>
import Home from "@/components/Home.vue";

export default {
  name: "main_page",
  data() {
    return {
      pageStack: [Home]
    };
  }
  //   mounted() {
  //     this.importAll(
  //       require.context(
  //         "../node_modules/leaflet-extra-markers/dist/img",
  //         true,
  //         /\.png$/
  //       )
  //     );
  //   }
  //,
};
</script>
