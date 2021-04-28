<template>
  <v-ons-dialog :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Reward Earned!</div>
    </header>
    <div class="content">
      <p>
        Congratulations you earned 1TT by wathing this video!
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
