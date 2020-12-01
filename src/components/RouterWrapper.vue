<template>
  <v-ons-navigator
    swipeable
    :page-stack="pageStack"
    :pop-page="goBack"
  ></v-ons-navigator>
</template>

<script>
import RootLoading from "@/pages/RootLoading.vue";
export default {
  name: "RouterWrapper",
  data() {
    return {
      pageStack: [RootLoading]
    };
  },
  watch: {
    $route(to, from) {
      console.log("to", to);
      console.log("from", from);
      const { 0: nextPage } = to.matched.map(m => m.components.default);
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
        this.pageStack.push(nextPage);
      }
    }
  },
  created() {
    //this.$router.push({ path: "/" });
  },
  methods: {
    goBack() {
      this.$router.push({
        name: this.$route.matched[this.$route.matched.length - 2].name
      });
    }
  }
};
</script>
