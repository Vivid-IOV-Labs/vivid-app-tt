<template>
  <v-ons-page>
    <div class="logo-page">
      <img class="logo-page__img" src="@/assets/img/logopeerkat.png" />
      <h1 class="logo-page__title">PEERKAT</h1>
    </div>
  </v-ons-page>
</template>

<script>
const delay = time => {
  let timer;
  clearTimeout(timer);
  return new Promise(resolve => {
    timer = setTimeout(() => {
      resolve(true);
    }, time);
  });
};
import OnBoarding from "@/components/OnBoarding.vue";

export default {
  name: "RootLoading",
  async mounted() {
    await delay(2000);
    this.$emit("push-page", OnBoarding);
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
}
</style>
