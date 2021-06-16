<template>
  <v-ons-dialog :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Terms and conditions</div>
    </header>
    <div class="content">
      <p>
        Please
        <a
          href="https://www.vividiov.com/peerkat-terms"
          target="_blank"
          class="btn--link btn--primary"
          >click here</a
        >
        to our read terms and conditions.
      </p>

      <div class="flex mt-4 flex-center-xy">
        <v-ons-button @click="sendAcceptedTerms" class="btn btn--large mb-4 ">
          Agree Terms
        </v-ons-button>
      </div>
    </div>
  </v-ons-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("user");
import { trackEvent } from "@/util/analytics";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(["acceptTerms"]),
    updateVisible(value) {
      this.$emit("input", value);
    },
    async sendAcceptedTerms() {
      await this.acceptTerms();
      trackEvent({
        category: "Terms and Conditions View",
        action: "accepts-terms"
      });
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
