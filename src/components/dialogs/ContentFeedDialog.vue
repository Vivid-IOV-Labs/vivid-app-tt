<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Feedback</div>
      <div class="right">
        <v-ons-button class="btn_close" @click="close">
          <base-icon class="btn__icon--white" name="times"></base-icon>
        </v-ons-button>
      </div>
    </header>
    <div class="scroller">
      <div class=" dialog-content" v-show="!feedBackSent">
        <div class="page__title__background mb-2">
          <h3 class="page__title">What do you want to see most? <br /></h3>
        </div>
        <i>Please select up to 3 categories</i>
        <div class="grid-x3 mt-4">
          <div
            class="grid-x3__cell flex-column flex-center-xy  mb-4 interests"
            v-for="interest in interests"
            :key="interest.label"
          >
            <base-check-button
              :name="interest.label"
              :selected="contentSelected.includes(interest.label)"
              :limit="limit"
              v-model="contentSelected"
            >
              <base-icon
                class="btn__icon"
                :fill="interest.fill"
                :name="interest.label"
              ></base-icon>
            </base-check-button>
            <span class="text-center interests__label">{{
              interest.text
            }}</span>
          </div>
          <div
            class="grid-x3__cell_full flex  mt-2 mb-4 flex-column flex-center-xy"
          >
            <v-ons-button
              :disabled="!contentSelected.length || isSendingFeedBack"
              @click="sendFeedBack"
              class="btn btn--large"
              data-testid="send-feedback"
            >
              Send Feedback
            </v-ons-button>
          </div>
        </div>
      </div>
      <div class=" content" v-show="feedBackSent">
        <div class="page__title__background">
          <h3 class="page__title">Become a Peerkat OG</h3>
        </div>
        <p class="mb-4 mt-4">
          Please join our Telegram group now to help us create an awesome
          platform for you
        </p>
        <div class="flex mt-4 mb-4 flex-column flex-center-xy">
          <h4 class="mb-4" style="margin:0">@PeerkatLive</h4>
          <v-ons-button @click="close" class="btn btn--large mt-4 ">
            Close Window
          </v-ons-button>
        </div>
      </div>
    </div>
  </v-ons-dialog>
</template>

<script>
import BaseCheckButton from "@/components/BaseCheckButton.vue";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapMutations } = createNamespacedHelpers("user");
import { trackEvent } from "@/util/analytics";

export default {
  components: {
    BaseCheckButton
  },
  data() {
    return {
      interests: [
        {
          label: "crypto",
          text: "Crypto",
          fill: true
        },
        {
          label: "gaming",
          text: "Gaming",
          fill: false
        },
        {
          label: "sports",
          text: "Sports",
          fill: true
        },
        {
          label: "entertainment",
          text: "Entertainment",
          fill: true
        },
        {
          label: "food_drink",
          text: "Food & Drink",
          fill: false
        },
        {
          label: "health_wellbeing",
          text: "Health & Wellbeing",
          fill: false
        },
        {
          label: "travel_outdoors",
          text: "Travel & Outdoors",
          fill: false
        },
        {
          label: "science_tech",
          text: "Science & Tech",
          fill: true
        }
      ],
      contentSelected: [],
      limit: 3,
      feedBackSent: false,
      isSendingFeedBack: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    onClose: {
      type: Function,
      default: () => Promise.resolve
    }
  },
  methods: {
    ...mapActions(["addUserInterests"]),
    ...mapMutations(["setInterestsSubmitted"]),
    updateVisible(value) {
      this.$emit("input", value);
    },
    close() {
      if (!this.contentSelected.length) {
        trackEvent({
          category: "Interest Feedback View",
          action: "feedback-notsent",
          label: "pop_up_closed"
        });
      }
      this.setInterestsSubmitted(true);
      this.$emit("input", false);
    },
    async sendFeedBack() {
      try {
        this.isSendingFeedBack = true;
        await this.addUserInterests(this.contentSelected);
        this.contentSelected.forEach(label => {
          trackEvent({
            category: "Interest Feedback View",
            action: "send-feedback",
            label
          });
        });
      } finally {
        this.isSendingFeedBack = false;
        this.feedBackSent = true;
      }
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
.grid-x3__cell_full {
  width: 100%;
  flex: 0 1 100%;
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
