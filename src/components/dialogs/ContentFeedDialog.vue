<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">Give us some Feedback</div>
        <div class="right">
          <v-ons-button class="btn_close" @click="close">
            <base-icon class="btn__icon--white" name="times"></base-icon>
          </v-ons-button>
        </div>
      </v-ons-toolbar>
      <div class="scroller content">
        <h3 class="page__title">What what do you like to see most?</h3>
        <div class="grid-x3">
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2 ">
            <label
              for="crypto_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="crypto"
                v-model="contentSelected"
                id="crypto_content"
              />

              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft nd mb-2"
              >
                <base-icon class="btn__icon" name="crypto"></base-icon>
              </v-ons-button>
              Crypto</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="gaming_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="gaming"
                v-model="contentSelected"
                id="gaming_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft nd mb-2"
              >
                <base-icon
                  class="btn__icon"
                  :fill="false"
                  name="gaming"
                ></base-icon> </v-ons-button
              >Gaming</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="sports_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="sports"
                v-model="contentSelected"
                id="sports_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft nd mb-2"
              >
                <base-icon
                  class="btn__icon"
                  name="sports"
                ></base-icon> </v-ons-button
              >Sports</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="entertainment_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="entertainment"
                v-model="contentSelected"
                id="entertainment_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft nd mb-2"
              >
                <base-icon
                  class="btn__icon"
                  name="entertainment"
                ></base-icon> </v-ons-button
              >Entertainment</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="food_drinks_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="food_drinks"
                v-model="contentSelected"
                id="food_drinks_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft mb-2"
              >
                <base-icon
                  class="btn__icon"
                  :fill="false"
                  name="food_drink"
                ></base-icon>
              </v-ons-button>
              Food &amp; Drink</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="healt_wellbeing_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="healt_wellbeing"
                v-model="contentSelected"
                id="healt_wellbeing_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft mb-2"
              >
                <base-icon
                  class="btn__icon"
                  :fill="false"
                  name="healt_wellbeing"
                ></base-icon> </v-ons-button
              >Healt &amp; Wellbeing</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="travel_outdoors_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="travel_outdoors"
                v-model="contentSelected"
                id="travel_outdoors_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft mb-2"
              >
                <base-icon
                  class="btn__icon"
                  :fill="false"
                  name="travel_outdoors"
                ></base-icon> </v-ons-button
              >Travel &amp; Outdoors</label
            >
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <label
              for="science_tech_content"
              class="mb-2 text-center flex-column flex-center-xy "
            >
              <input
                type="checkbox"
                style="display:none"
                value="science_tech"
                v-model="contentSelected"
                id="science_tech_content"
              />
              <v-ons-button
                class="btn btn--checkbox btn--round-large text-azure btn--opacity-soft mb-2"
              >
                <base-icon
                  class="btn__icon"
                  name="science_tech"
                ></base-icon> </v-ons-button
              >Science &amp; Tech</label
            >
          </div>
        </div>
        <h3 class="page__title">Become a Peerkat OG</h3>
        <p>
          Please join our Telegram group now to help us create an awesome
          platform for you
        </p>
        <div class="flex mt-2 mb-2 flex-center-xy">
          <a
            href="https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw"
            target="_blank"
            class="btn btn--round-large btn--opacity-soft mb-2 "
          >
            <base-icon class="btn__icon" name="telegram"></base-icon>
          </a>
        </div>
        <hr class="hr-space" />
      </div>
    </v-ons-page>
  </v-ons-dialog>
</template>

<script>
export default {
  name: "ContentFeedDialog",
  data() {
    return {
      contentSelected: []
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
input[type="checkbox"]:checked ~ .btn--checkbox {
  border: 2px solid $azure;
}
.btn--checkbox:hover {
  background: $dark-grey;
  color: $azure;
}
.btn--checkbox {
  background: $dark-grey;
  color: $azure;
  border: 2px solid $dark-grey;
}
</style>
