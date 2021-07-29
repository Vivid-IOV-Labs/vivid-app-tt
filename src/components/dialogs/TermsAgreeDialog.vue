<template>
  <v-ons-dialog :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Terms of Use and Privacy Notice</div>
    </header>
    <div class="content">
      <p>
        <strong>Welcome to Peerkat! </strong> <br />
        We have made a number of updates including the new Peerkat Earn feature.
        <br />
        Therefore we have also updated our Terms of Use and Privacy Notice,
        please check them over before continuing to Peerkat.
      </p>
      <ul style="padding: 0; margin:0; list-style: none;">
        <li style="margin:1rem 0 1.2rem 0">
          <label class="left flex">
            <v-ons-checkbox
              style="margin-right: 0.8rem;"
              v-model="termsAccepted"
            ></v-ons-checkbox>
            <span>
              I confirm that I have read, consent and agree to
              <a
                href="https://www.vividiov.com/peerkat-terms/"
                target="_blank"
                class="text-bold text-azure"
                >Terms of Use</a
              >.
            </span>
          </label>
        </li>
        <li>
          <label class="left flex">
            <v-ons-checkbox
              style="margin-right: 0.8rem;"
              v-model="privacyAccepted"
            ></v-ons-checkbox>
            <span>
              I confirm that I have read, consent and agree to
              <a
                href="https://www.vividiov.com/privacy/"
                target="_blank"
                class="text-bold text-azure"
                >Privacy Notice</a
              >.
            </span>
          </label>
        </li>
      </ul>
      <div class="flex mt-4 flex-center-xy">
        <v-ons-button
          :disabled="!(termsAccepted && privacyAccepted)"
          @click="sendAcceptedTerms"
          class="btn btn--large mb-4 "
        >
          Continue
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
  data: function() {
    return {
      termsAccepted: false,
      privacyAccepted: false
    };
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
