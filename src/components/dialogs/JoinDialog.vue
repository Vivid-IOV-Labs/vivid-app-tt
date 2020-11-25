<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">Latest Live Streams</div>
        <div class="right">
          <v-ons-button class="btn_close" @click="close">
            <base-icon class="btn__icon--white" name="times"></base-icon>
          </v-ons-button>
        </div>
      </v-ons-toolbar>
      <div class="scroller">
        <v-ons-list>
          <v-ons-list-item v-for="marker in markers" :key="marker.id">
            <div class="flex-center-y full-width p-4">
              <div>
                <h3>{{ marker.mapPin.details }}</h3>
                <p>
                  {{
                    marker.mapPin.twitterHashTags
                      .reduce((acc, tag) => {
                        acc += ` #${tag},`;
                        return acc;
                      }, "")
                      .slice(1, -1)
                  }}
                </p>
              </div>

              <div class="ml-auto">
                <v-ons-button
                  class="btn btn--join bnt--large text-center"
                  @click="join(marker.openLocationCode)"
                  >Trending
                  <base-icon class="btn__icon" name="users"></base-icon
                ></v-ons-button>
              </div>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </div>
    </v-ons-page>
  </v-ons-dialog>
</template>

<script>
export default {
  name: "JoinDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    markers: {
      type: Array,
      default: () => {
        [];
      }
    },
    onClose: {
      type: Function,
      default: () => Promise.resolve
    }
  },
  methods: {
    updateVisible(value) {
      this.$emit("input", value);
    },
    close() {
      this.$emit("input", false);
    },
    join(_str) {
      this.$emit("input", false);

      this.$emit("push-viewstream", _str);
    }
  }
};
</script>
