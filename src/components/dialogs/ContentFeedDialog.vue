<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Please help with feedback</div>
      <div class="right">
        <v-ons-button class="btn_close" @click="close">
          <base-icon class="btn__icon--white" name="times"></base-icon>
        </v-ons-button>
      </div>
    </header>
    <div class="scroller content" v-if="!feedBackSent">
      <div class="page__title__background">
        <h3 class="page__title">What do you want to see most? <br /></h3>
      </div>
      <i>Please select up to 3 categories</i>
      <hr class="hr-space" />
      <div class="grid-x3">
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
          <span class="text-center interests__label">{{ interest.text }}</span>
        </div>
      </div>
      <div class="flex mt-2 mb-4 flex-center-xy">
        <v-ons-button
          :disabled="!contentSelected.length"
          @click="sendFeedBack"
          class="btn btn--large mb-4 "
        >
          Send Feedback
        </v-ons-button>
      </div>
      <hr class="hr-space" />
    </div>
    <div class="scroller content" v-else>
      <div class="page__title__background">
        <h3 class="page__title">Become a Peerkat OG</h3>
      </div>
      <p class="mb-4 mt-4">
        Please join our Telegram group now to help us create an awesome platform
        for you
      </p>
      <div class="flex mt-4 mb-4 flex-column flex-center-xy">
        <v-ons-button
          class="btn btn--round-large btn--opacity-soft mb-4 "
          @click="copyTelegramGroup"
        >
          <base-icon class="btn__icon" name="telegram"></base-icon>
          <input
            type="hidden"
            id="telegram-group"
            value="https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw"
          />
        </v-ons-button>
        <h3 class="mb-4 mt-4" style="margin:0">Peerkat</h3>
        <h4 class="mb-4" style="margin:0">@PeerkatLive</h4>
        <hr class="hr-space" />

        <v-ons-button @click="close" class="btn btn--large mt-4 ">
          Close Window
        </v-ons-button>
      </div>
      <hr class="hr-space" />
    </div>
  </v-ons-dialog>
</template>

<script>
import BaseCheckButton from "@/components/BaseCheckButton.vue";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("user");
import { trackEvent } from "@/util/analytics";

export default {
  name: "ContentFeedDialog",
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
      feedBackSent: false
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
    updateVisible(value) {
      this.$emit("input", value);
    },
    close() {
      if (!this.contentSelected.length) {
        trackEvent({
          category: "Interest Feedback View",
          action: "feedback-notsent"
        });
      }

      this.$emit("input", false);
    },
    copyTelegramGroup() {
      let testingCodeToCopy = document.querySelector("#telegram-group");
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      testingCodeToCopy.setSelectionRange(0, 99999); /* For mobile devices */

      try {
        document.execCommand("copy");
        trackEvent({
          category: "Interest Feedback View",
          action: "copy-social",
          label: "telegram"
        });
        this.$ons.notification.toast("Telegram copied successfully!", {
          timeout: 2000
        });
      } catch (err) {
        this.$ons.notification.toast("Oops, unable to copy ", {
          timeout: 2000
        });
      }

      /* unselect the range */
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    async sendFeedBack() {
      await this.addUserInterests(this.contentSelected);
      this.contentSelected.forEach(label => {
        trackEvent({
          category: "Interest Feedback View",
          action: "send-feedback",
          label
        });
      });
      this.feedBackSent = true;
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
