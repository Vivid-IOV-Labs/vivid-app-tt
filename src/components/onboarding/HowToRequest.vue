<template>
  <v-ons-page>
    <h5 class="text-center">How To Request</h5>
    <v-ons-list style="flex:1">
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <div class="btn btn--large btn--request btn--fake">
            <base-icon name="request"></base-icon>
          </div>
        </div>
        <div class="flex-center">
          <p>CLICK THE REQUEST VIDEO BUTTON TO ASK FOR A LIVE STREAM</p>
        </div>
      </v-ons-list-item>
      <v-ons-list-item style="display:flex; padding:1rem">
        <div class="flex-center">
          <img
            style="margin:0 auto; display:block;max-height:3rem"
            src="../../assets/flag.png"
            alt
          />
          <img
            style="margin:0 auto; display:block;max-height:3rem"
            src="../../assets/peerkat.svg"
            alt
          />
        </div>
        <div class="flex-center">
          <p>WAIT FOR YOUR REQUEST FLAG TO TURN TO A LIVE PEERKAT STREAM</p>
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
          <p>CLICK ON GOLD COIN TO SEND 1 TT TIP TO THE STREAMER</p>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import BaseIcon from "@/components/BaseIcon";
export default {
  name: "HowToRequest",
  components: {
    BaseIcon
  }
};
</script>

<style>
.flex-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn--fake {
  background: #fff;
  border-width: 2px;
  padding: 1rem 2rem;
}
</style>
