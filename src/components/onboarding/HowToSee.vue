<template>
  <div>
    <h5 class="text-center">SEE WHAT’S HAPPENING</h5>
    <v-ons-list>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <div class="btn btn--large btn--join btn--fake">
            <base-icon class="btn__icon" name="users"></base-icon>
          </div>
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>FOLLOW THE LATEST LIST OF TRENDING LIVE STREAMS</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/peerkat.svg" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>OR CHECK THE MAP FOR LIVE STREAMS IN DIFFERENT LOCATIONS</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex p-4">
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
