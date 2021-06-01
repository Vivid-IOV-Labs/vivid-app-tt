<template>
  <v-ons-dialog :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Disconnect Twitter</div>
    </header>
    <div class="content">
      <p>
        Are you sure that you would like to disconnect your Twitter account from
        Peerkat?
      </p>

      <div class="flex mt-4 flex-center-xy">
        <v-ons-button @click="confirm" class="btn btn--large mb-4 mr-4">
          Confirm
        </v-ons-button>
        <v-ons-button @click="cancel" class="btn btn--large mb-4 ">
          Cancel
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
    onCancel: {
      type: Function,
      default: () => {}
    },
    onConfirm: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    updateVisible(value) {
      this.$emit("input", value);
    },
    async cancel() {
      this.onCancel();
      this.$emit("input", false);
    },
    async confirm() {
      await this.onConfirm();
      this.$emit("input", false);
    }
  }
};
</script>
<style lang="scss">
.grid-x3 {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: space-between;
}

.grid-x3__cell {
  width: 40%;
  flex: 0 1 40%;
}
.interests__label {
  font-size: 0.8rem;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .grid-x3__cell {
    flex: 0 1 40%;
  }
}

@media (max-width: 767px) {
  .grid-x3__cell {
    margin-bottom: 1rem;
    flex: 0 1 40%;
  }
}
</style>
