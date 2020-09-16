<template>
  <v-ons-page>
    <h5 class="text-center">SEE WHAT’S HAPPENING</h5>
    <v-ons-list style="flex:1">
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <div class="btn btn--large btn--join btn--fake">Trending</div>
        </div>
        <div class="flex-center">
          <p>FOLLOW THE LATEST LIST OF TRENDING LIVE STREAMS</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <img
            style="margin:0 auto; display:block;max-height:4rem"
            src="../../assets/peerkat.png"
            alt
          />
        </div>
        <div class="flex-center">
          <p>OR CHECK THE MAP FOR LIVE STREAMS IN DIFFERENT LOCATIONS</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <img
            style="margin:0 auto; display:block;max-height:4rem"
            src="../../assets/tipping.png"
            alt
          />
        </div>
        <div class="flex-center">
          <p>DON’T FORGET TO TIP THE STREAMS YOU LIKE!</p>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  name: "HowToSee"
};
</script>

<style lang="scss" scoped></style>
