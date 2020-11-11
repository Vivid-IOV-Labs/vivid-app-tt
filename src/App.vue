<template>
  <v-ons-navigator
    swipeable
    :page-stack="pageStack"
    @push-page="onPushPage"
    @back-page="pageStack.pop()"
    @reset-home-page="
      pageStack.pop();
      pageStack.push($event);
    "
  ></v-ons-navigator>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Source Code Pro");

@import "assets/css/app.css";
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
  },
  methods: {
    onPushPage(event) {
      const indexInPageStack = this.pageStack.findIndex(
        page => page.name == event.name
      );
      if (indexInPageStack > -1) {
        // this.pageStack.splice(
        //   this.pageStack.length,
        //   0,
        //   this.pageStack.splice(indexInPageStack, 1)[0]
        // );
        //clear the stack and reload everytime the view
        this.pageStack = [];
        this.pageStack.push(event);
      } else {
        this.pageStack.push(event);
      }
    }
  }
};
</script>
