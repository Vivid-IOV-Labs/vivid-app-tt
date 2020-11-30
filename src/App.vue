<template>
  <div>
    <BaseIconSprite />
    <!-- <v-ons-navigator
      swipeable
      swipe-target-width="200px"
      :page-stack="pageStack"
      :pop-page="goBack"
    ></v-ons-navigator> -->
    <v-ons-splitter>
      <v-ons-splitter-content>
        <router-view></router-view>
      </v-ons-splitter-content>
    </v-ons-splitter>
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
export default {
  name: "main_page",
  components: {
    BaseIconSprite
  },
  data() {
    return {
      pageStack: []
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        name: this.$route.matched[this.$route.matched.length - 2].name
      });
    }
  },
  created() {
    this.$router.push({
      path: "/"
    });
    const mapRouteStack = route =>
      (this.pageStack = route.matched.map(m => m.components.default));
    mapRouteStack(this.$route);
    this.$router.beforeEach((to, from, next) => mapRouteStack(to) && next());
  }
};
</script>
