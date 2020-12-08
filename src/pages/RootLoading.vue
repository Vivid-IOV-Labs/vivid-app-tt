<template>
  <v-ons-page>
    <div class="logo-page">
      <img class="logo-page__img" src="@/assets/img/logopeerkat.png" />
      <h1 class="logo-page__title">PEERKAT</h1>
    </div>
  </v-ons-page>
</template>

<script>
import delay from "@/util/delay.js";
export default {
  name: "RootLoading",
  async beforeCreate() {
    await this.$store.dispatch("smartcontract/getWeb3Provider");
  },
  async mounted() {
    await delay(4000);
    this.$router.push({ path: "viewvideo" });
  }
};
</script>
<style lang="scss">
.logo-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background: $black;
}
.logo-page .logo-page__title {
  font-weight: bolder;
  color: $azure;
  font-size: 2.3rem;
  margin: 0.6rem 0;
}
.logo-page .logo-page__img {
  width: 40%;
  max-width: 8rem;
}
</style>
