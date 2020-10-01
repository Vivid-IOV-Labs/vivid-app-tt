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
import RootLoading from "@/components/RootLoading.vue";

export default {
  name: "main_page",
  data() {
    return {
      pageStack: [RootLoading]
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
