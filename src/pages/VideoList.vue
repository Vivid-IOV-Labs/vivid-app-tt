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
      <v-ons-list>
        <v-ons-list-item v-for="media in getAll" :key="media.mediaID">
          <div class="flex-center-y full-width p-4">
            <div>
              <h3>{{ media.details }}</h3>
              <p>
                {{ media.twitter.hashtags }}
              </p>
            </div>

            <div class="ml-auto">
              <v-ons-button
                @click="pushToVideo"
                class="btn btn--round bnt--large text-center"
              >
                <base-icon class="btn__icon" name="angle-right"></base-icon
              ></v-ons-button>
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
    pushToVideo() {
      this.$router.push({ path: "viewvideo" });
    }
  }
};
</script>
