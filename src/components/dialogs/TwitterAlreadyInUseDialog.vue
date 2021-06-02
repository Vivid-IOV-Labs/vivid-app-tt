<template>
  <v-ons-dialog :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Invalid Connection!</div>
    </header>
    <div class="content">
      <p>
        Twitter profile has already been linked to Peerkat App
      </p>

      <div class="flex mt-4 flex-center-xy">
        <v-ons-button @click="close" class="btn btn--large mb-4 ">
          OK
        </v-ons-button>
      </div>
    </div>
  </v-ons-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    updateVisible(value) {
      this.$emit("input", value);
    },
    close() {
      this.$emit("input", false);
    }
  }
};
</script>
