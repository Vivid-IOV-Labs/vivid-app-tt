<template>
  <div>
    <h5 class="text-center">How To Request</h5>
    <v-ons-list>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <div class="btn btn--large btn--request btn--fake">
            <base-icon name="request"></base-icon>
          </div>
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>CLICK THE REQUEST VIDEO BUTTON TO ASK FOR A LIVE STREAM</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/flag.png" alt />
          <img class="howtoicon" src="../../assets/img/peerkat.svg" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>WAIT FOR YOUR REQUEST FLAG TO TURN TO A LIVE PEERKAT STREAM</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item class="flex p-4">
        <div class="flex-center-xy flex-stretch">
          <img class="howtoicon" src="../../assets/img/tipping.png" alt />
        </div>
        <div class="flex-center-xy flex-stretch">
          <p>CLICK ON GOLD COIN TO SEND 1 TT TIP TO THE STREAMER</p>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </div>
</template>

<script>
export default {
  name: "HowToRequest"
};
</script>
