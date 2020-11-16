<template>
  <div>
    <h5 class="text-center">GO LIVE TO THE WORLD!</h5>
    <v-ons-list>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <div class="btn btn--large btn--golive btn--fake">
            <base-icon class="btn__icon" name="video"></base-icon>
          </div>
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>TO INSTANTLY BROADCAST TO YOUR PEERS, CLICK GO LIVE</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/hashtag.png" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>ADD HASHTAGS TO HELP USERS DISCOVER YOUR STREAM</p>
        </div>
      </v-ons-list-item>

      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/shopping.png" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>INCLUDE A SHOPPING URL LINK IF YOU ARE SELLING IN YOUR STREAM</p>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </div>
</template>

<script>
export default {
  name: "HowToGoLive"
};
</script>
