<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <head-logo></head-logo>
      </div>
      <div class="right">
        <head-menu></head-menu>
      </div>
    </v-ons-toolbar>
    <div class="scroller">
      <h3>Latest Videos</h3>
      <v-ons-list modifier="tappable">
        <v-ons-list-item
          v-for="media in getAll"
          :key="media.mediaID"
          @click="pushToVideo(media.mediaID)"
        >
          <div class="flex-center-y full-width p-4">
            <div>
              <h3>{{ media.details }}</h3>
              <p>
                {{ media.twitter.hashtags }}
              </p>
            </div>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
    <v-ons-bottom-toolbar></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import HeadLogo from "@/components/HeadLogo.vue";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("media");

export default {
  name: "VideoList",
  components: {
    HeadMenu,
    HeadLogo
  },
  created() {
    this.populateAll();
  },
  computed: {
    ...mapGetters(["getAll"])
  },
  methods: {
    ...mapActions(["populateAll"]),
    pushToVideo(mediaID) {
      this.$router.push({ path: `viewvideo/${mediaID}` });
    }
  }
};
</script>
<style lang="scss" scoped>
.page__background {
  background: lighten($color: $dark-grey, $amount: 15);
}
.page,
.page__content {
  background: lighten($color: $dark-grey, $amount: 15);
  color: $white;
}
.bottom-bar,
.toolbar {
  background-image: none;
  background: $dark-grey;
}
.list {
  background: lighten($color: $dark-grey, $amount: 15);
}
.list-item {
  color: $white;
}
</style>
