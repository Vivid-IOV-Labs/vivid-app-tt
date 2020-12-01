<template>
  <div>
    <BaseIconSprite />
    <v-ons-navigator
      swipeable
      :page-stack="pageStack"
      :pop-page="goBack"
    ></v-ons-navigator>
    <!-- <v-ons-splitter>
      <v-ons-splitter-content>
        <router-view></router-view>
      </v-ons-splitter-content>
    </v-ons-splitter> -->
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source Code Pro");

@import "assets/css/app.scss";
body {
  font-family: "Source Code Pro";
}
</style>

<script>
import BaseIconSprite from "@/components/BaseIconSprite.vue";
import RootLoading from "@/components/RootLoading.vue";
export default {
  name: "main_page",
  components: {
    BaseIconSprite
  },
  data() {
    return {
      pageStack: [RootLoading]
    };
  },
  watch: {
    $route(to) {
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
  methods: {
    goBack() {
      this.$router.push({
        name: this.$route.matched[this.$route.matched.length - 2].name
      });
    },
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
