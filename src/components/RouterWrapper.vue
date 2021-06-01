<template>
  <v-ons-navigator
    swipeable
    @reset-home-page="
      pageStack.pop();
      pageStack.push($event);
    "
    :page-stack="pageStack"
    :pop-page="goBack"
  ></v-ons-navigator>
</template>

<script>
import RootLoading from "@/pages/RootLoading.vue";
import { trackPage } from "../util/analytics";
export default {
  name: "RouterWrapper",
  data() {
    return {
      pageStack: [RootLoading]
    };
  },
  watch: {
    $route: {
      handler: "onRouteChange",
      immediate: true,
      deep: true
    }
  },
  methods: {
    async onRouteChange(to) {
      // console.log("routeWrapper", to);
      trackPage(to.path);
      const { 0: nextPage } = to.matched.map(m => m.components.default);
      // console.log("routeWrapper nextPage", nextPage);

      if (nextPage) {
        const indexInPageStack = this.pageStack.findIndex(
          page => page.name == nextPage.name
        );
        if (indexInPageStack > -1) {
          // this.pageStack.splice(
          //   this.pageStack.length,
          //   0,
          //   this.pageStack.splice(indexInPageStack, 1)[0]
          // );
          //clear the stack and reload everytime the view
          this.pageStack = [];
          this.pageStack.push(nextPage);
        } else {
          this.pageStack = [];
          this.pageStack.push(nextPage);
        }
      }
    },
    goBack() {
      this.$router.back();
      // this.$router.push({
      //   name: this.$route.matched[this.$route.matched.length - 1].name
      // });
    }
  }
};
</script>
