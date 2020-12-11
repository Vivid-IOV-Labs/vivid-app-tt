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

import { address, ABI } from "@/util/constants/tippingContract";

import { ethers } from "ethers";

export default {
  name: "RootLoading",
  methods: {
    async tipStreamer() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tippingContract = await new ethers.Contract(address, ABI, provider);

      const tippingContractWithSigner = await tippingContract.connect(signer);

      var overrideOptions = {
        gasLimit: 250000,
        gasPrice: 9000000000,
        nonce: 0,
        value: ethers.utils.parseEther('1.0')
    };

    let result = await tippingContractWithSigner.tip("0x6537da7F34d3454fce2bD9534491935687014bBd", overrideOptions);
    
    let waitRes = await result.wait()

    waitRes = JSON.stringify(waitRes)
    console.log(waitRes)

  
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
