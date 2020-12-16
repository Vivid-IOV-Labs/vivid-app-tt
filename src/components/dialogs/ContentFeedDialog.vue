<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <header class="dialog__head">
      <div class="dialog__head__title">Give us some Feedback</div>
      <div class="right">
        <v-ons-button class="btn_close" @click="close">
          <base-icon class="btn__icon--white" name="times"></base-icon>
        </v-ons-button>
      </div>
    </header>
    <div class="scroller content" v-if="!feedBackSent">
      <div class="page__title__background">
        <h3 class="page__title">What do you like to see most?</h3>
      </div>
      <div class="grid-x3">
        <div
          class="grid-x3__cell flex-column flex-center-xy  mb-4 "
          v-for="preference in preferences"
          :key="preference.label"
        >
          <base-check-button
            :name="preference.label"
            :selected="contentSelected.includes(preference.label)"
            :limit="1"
            v-model="contentSelected"
          >
            <base-icon
              class="btn__icon"
              :fill="preference.fill"
              :name="preference.label"
            ></base-icon>
          </base-check-button>
          <span class="text-center">{{ preference.text }}</span>
        </div>
      </div>
      <div class="flex mt-2 mb-4 flex-center-xy">
        <v-ons-button @click="sendFeedBack" class="btn btn--large mb-4 ">
          Send Feedback
        </v-ons-button>
      </div>
    </div>
    <div class="scroller content" v-else>
      <div class="page__title__background">
        <h3 class="page__title">Become a Peerkat OG</h3>
      </div>
      <p>
        Please join our Telegram group now to help us create an awesome platform
        for you
      </p>
      <div class="flex mt-2 mb-4 flex-center-xy">
        <a
          href="https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw"
          target="_blank"
          class="btn btn--round-large btn--opacity-soft mb-4 "
        >
          <base-icon class="btn__icon" name="telegram"></base-icon>
        </a>
      </div>
    </div>

    <hr class="hr-space" />
  </v-ons-dialog>
</template>

<script>
import BaseCheckButton from "@/components/BaseCheckButton.vue";
export default {
  name: "ContentFeedDialog",
  components: {
    BaseCheckButton
  },
  data() {
    return {
      preferences: [
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
          label: "healt_wellbeing",
          text: "Healt & Wellbeing",
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
      limit: 1,
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
    updateVisible(value) {
      this.$emit("input", value);
    },
    close() {
      this.$emit("input", false);
    },
    sendFeedBack() {
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
  justify-content: flex-end;
}

.grid-x3__cell {
  width: 25%;
  flex: 0 1 25%;
}

@media (max-width: 1024px) {
  .grid-x3__cell {
    flex: 0 1 25%;
  }
}

@media (max-width: 767px) {
  .grid-x3__cell {
    margin-bottom: 1rem;
    flex: 0 1 25%;
  }
}
</style>
