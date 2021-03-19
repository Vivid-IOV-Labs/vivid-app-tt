<template>
  <v-ons-dialog :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Please accept our terms</div>
    </header>
    <div class=" content">
      <div class="page__title__background">
        <h3 class="page__title">
          Terms and conditions
        </h3>
      </div>
      <i
        >Please read trhough and accept our terms and conditions in order to
        proceed</i
      >
      <div class="flex mt-2 flex-center-xy">
        <v-ons-button @click="sendAcceptedTerms" class="btn btn--large mb-4 ">
          I agree
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
  name: "TermsAgreeDialog",
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
