<template>
  <v-ons-page>
    <div class="loading-page">
      <img class="loading-page__img" src="@/img/logopeerkat.png" />
      <h1 class="loading-page__title">PEERKAT</h1>
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
  methods: {
    endOnBoarding() {
      this.$emit("back-page");
    }
  },
  async mounted() {
    await delay(2000);
    this.$emit("push-page", OnBoarding);
  }
};
</script>
<style>
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background: #000;
}
.loading-page .loading-page__title {
  font-weight: bolder;
  color: #16dbdb;
  font-size: 2.3rem;
  margin: 0.6rem 0;
}
.loading-page .loading-page__img {
  width: 40%;
}
</style>
