<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    Join Dialog POP Up
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">Latest Live Streams</div>
      </v-ons-toolbar>
      <v-ons-list>
        <v-ons-list-item v-for="marker in markers" :key="marker.id">
          <div style="display:flex;flex-direction:column; padding:1rem">
            <label for="">Join Title</label>
            <v-ons-input
              style="border-bottom:solid 1px #ddd; width:100%"
              placeholder="What do you want to watch? "
            >
            </v-ons-input>
            <small>[10 words max]</small>
            <v-ons-button
              style="width: 90%;
            text-align: center;
            padding: 1rem;
            background: #73E335;
            color: #000;"
              @click="closeJoinDialog"
            >
              Join
            </v-ons-button>
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
    closeJoinDialog() {
      // this.onClose();
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
