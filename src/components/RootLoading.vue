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
const getPosition = options => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
};
import devLog from "@/util/devlog.js";

export default {
  name: "RootLoading",
  methods: {
    async getLocation() {
      const options = {
        timeout: 1000,
        maximumAge: 10000,
        enableHighAccuracy: true
      };
      try {
        const position = await getPosition(options);
        this.$store.dispatch("setPosition", position);
      } catch (err) {
        devLog(err.message);
      }
    }
  },
  created() {},
  async mounted() {
    await this.getLocation();
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
