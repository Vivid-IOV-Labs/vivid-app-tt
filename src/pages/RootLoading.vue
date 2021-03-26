<template>
  <v-ons-page>
    <div class="logo-page">
      <div class="logo-page__main">
        <img class="logo-page__img" src="@/assets/img/logopeerkat.svg" />
        <h4 class="logo-page__subtitle">
          Watch the latest videos &amp; tip the creator with TT
        </h4>
      </div>

      <div class="logo-page__footer">
        <h5 class="logo-page__copyright">
          © 2021 Peerkat. All rights reserved.
        </h5>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import delay from "@/util/delay.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RootLoading",
  computed: {
    ...mapGetters("smartcontract", ["getUserWalletAddress"])
  },
  methods: {
    ...mapActions("user", ["login"]),
    ...mapActions("smartcontract", ["createSmartContractFactory"])
  },
  async mounted() {
    // await this.createSmartContractFactory();

    // if (this.getUserWalletAddress) {
    //   await this.login(this.getUserWalletAddress);
    // }
    await delay(2000);
    this.$router.push({ path: "videolist" });
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
  .logo-page__main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: $black;
  }
  .logo-page .logo-page__title {
    font-weight: bolder;
    color: $azure;
    font-size: 2.3rem;
    margin: 0.6rem 0;
  }
  .logo-page__subtitle {
    font-weight: bold;
    color: $white;
    text-align: center;
    font-size: 1.4rem;
    margin: 0.8rem 0;
    padding: 0 1.8rem;
  }
  .logo-page__copyright {
    font-weight: bolder;
    color: $white;
    text-align: center;
    font-size: 1rem;
    margin: 0.6rem 0 0.4rem;
    padding: 0 1.4rem 0.3rem;
  }
  .logo-page .logo-page__img {
    width: 60%;
  }
}
</style>
