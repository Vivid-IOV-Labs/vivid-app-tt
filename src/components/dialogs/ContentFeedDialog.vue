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
        <h3>What what do you like to see most?</h3>
        <div class="grid-x3">
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2 ">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="crypto"></base-icon>
            </v-ons-button>
            <span class="mb-2">Crypto</span>
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="gaming"></base-icon>
            </v-ons-button>
            <span class="mb-2">Gaming</span>
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="sports"></base-icon>
            </v-ons-button>
            <span class="mb-2">Sports</span>
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="entertainment"></base-icon>
            </v-ons-button>
            <span class="mb-2">Entertainment</span>
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="food_drink"></base-icon>
            </v-ons-button>
            food&drink
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="healt_wellbeing"></base-icon>
            </v-ons-button>
            <span class="mb-2">Healt &amp; Wellbeing</span>
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="travel_outdoors"></base-icon>
            </v-ons-button>
            <span class="mb-2">Travel &amp; Outdoors</span>
          </div>
          <div class="grid-x3__cell flex-column flex-center-xy  mb-2">
            <v-ons-button
              class="btn btn--large  btn--opacity-soft btn--circle mb-2"
            >
              <base-icon class="btn__icon" name="science_tech"></base-icon>
            </v-ons-button>
            <span class="mb-2">Science &amp; Tech</span>
          </div>
        </div>
      </div>
    </v-ons-page>
  </v-ons-dialog>
</template>

<script>
export default {
  name: "ContentFeedDialog",
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
  align-items: center;
  justify-content: flex-end;
}

.grid-x3__cell {
  flex: 0 1 48%;
}

@media (max-width: 1024px) {
  .grid-x3__cell {
    flex: 0 1 48%;
  }
}

@media (max-width: 767px) {
  .grid-x3__cell {
    margin-bottom: 1rem;
    flex: 0 1 48%;
  }
}
</style>
