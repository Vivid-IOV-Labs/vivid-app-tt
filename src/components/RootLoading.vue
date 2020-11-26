<template>
  <v-ons-page>
    <div class="logo-page">
      <img class="logo-page__img" src="@/assets/img/logopeerkat.png" />
      <h1 class="logo-page__title">PEERKAT</h1>
      <v-ons-button
        @click.prevent="tipStreamer()"
        class="btn--default btn--request btn--fake.btn--request"
      >
        Tip
      </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
// const delay = time => {
//   let timer;
//   clearTimeout(timer);
//   return new Promise(resolve => {
//     timer = setTimeout(() => {
//       resolve(true);
//     }, time);
//   });
// };

import { mapGetters } from "vuex";
import { address, ABI } from "@/util/constants/tippingContract";

export default {
  name: "RootLoading",
  ...mapGetters({ _getStreamerWalletAddress: "getStreamerWalletAddress" }),
  async beforeCreate() {
    this.$store.dispatch("registerWeb3");
  },
  methods: {
    async tipStreamer() {
      let amount = 1;

      let tippingContract = await window.web3.eth.contract(ABI);
      let tippingContractInstance = await tippingContract.at(address);

      await tippingContractInstance.tip(
        "0x6537da7F34d3454fce2bD9534491935687014bBd",
        {
          gas: 300000,
          gasPrice: "0x14f46b0400",
          value: window.web3.toWei(String(amount), "ether"),
          from: this.$store.state.web3.coinbase
        }
      );
    }
  }
};
</script>
<style>
.logo-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background: #000;
}
.logo-page .logo-page__title {
  font-weight: bolder;
  color: #16dbdb;
  font-size: 2.3rem;
  margin: 0.6rem 0;
}
.logo-page .logo-page__img {
  width: 40%;
  max-width: 8rem;
}
</style>
