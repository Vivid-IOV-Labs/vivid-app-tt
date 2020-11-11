<template>
  <v-ons-page>
    <h5 class="text-center">GO LIVE TO THE WORLD!</h5>
    <v-ons-list style="flex:1">
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <div class="btn btn--large btn--golive btn--fake">
            <v-ons-icon class="btn__icon" icon="fa-video"></v-ons-icon>
          </div>
        </div>
        <div class="flex-center">
          <p>TO INSTANTLY BROADCAST TO YOUR PEERS, CLICK GO LIVE</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <img
            style="margin:0 auto; display:block;max-height:4rem"
            src="../../assets/img/hashtag.png"
            alt
          />
        </div>
        <div class="flex-center">
          <p>ADD HASHTAGS TO HELP USERS DISCOVER YOUR STREAM</p>
        </div>
      </v-ons-list-item>

      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <img
            style="margin:0 auto; display:block;max-height:4rem"
            src="../../assets/img/shopping.png"
            alt
          />
        </div>
        <div class="flex-center">
          <p>INCLUDE A SHOPPING URL LINK IF YOU ARE SELLING IN YOUR STREAM</p>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  name: "HowToGoLive"
};
</script>

<style scoped></style>
