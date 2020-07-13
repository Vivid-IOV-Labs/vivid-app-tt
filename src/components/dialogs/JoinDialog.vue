<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">Latest Live Streams</div>
        <div class="right">
          <v-ons-button
            style="float:right;  box-shadow:none; background:transparent; border:none"
            @click="close"
          >
            <v-ons-icon class="btn__icon--white" icon="fa-times"></v-ons-icon>
          </v-ons-button>
        </div>
      </v-ons-toolbar>
      <v-ons-list style="flex:1">
        <v-ons-list-item v-for="marker in markers" :key="marker.id">
          <div
            style="display: flex;padding: 1rem;width: 100%; align-items: center;"
          >
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

            <div style="margin-left:auto">
              <v-ons-button
                class="btn btn--join"
                style="
            text-align: center;
            padding: 0.6rem 1rem;"
                @click="join(marker.openLocationCode)"
                >Join <v-ons-icon class="btn__icon" icon="fa-users"></v-ons-icon
              ></v-ons-button>
            </div>
          </div>
        </v-ons-list-item>
      </v-ons-list>
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

<style lang="scss" scoped></style>
