<template>
  <div class="onboarding-page">
    <h4 class="onboarding-page__title">SEE WHAT’S HAPPENING</h4>
    <v-ons-list class="onboarding-page__list">
      <v-ons-list-item class="flex ">
        <div class="flex-center-xy flex-stretch">
          <div class="btn btn--large btn--join btn--fake">
            <base-icon class="btn__icon" name="users"></base-icon>
          </div>
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>FOLLOW THE LATEST LIST OF TRENDING LIVE STREAMS</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/peerkat.svg" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>OR CHECK THE MAP FOR LIVE STREAMS IN DIFFERENT LOCATIONS</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/tipping.png" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>DON’T FORGET TO TIP THE STREAMS YOU LIKE!</p>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </div>
</template>

<script>
export default {
  name: "HowToSee"
};
</script>
