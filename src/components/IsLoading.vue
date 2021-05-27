<template>
  <transition name="fade">
    <div v-if="isLoading" class="isloading flex-center-xy">
      <img class="isloading__img" src="@/assets/img/loading.png" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("uistates", ["isLoading"])
  }
};
</script>

<style lang="scss">
.isloading {
  position: fixed;
  height: 100%;
  width: 100%;
  background: $black;
  z-index: 99999;
  .isloading__img {
    animation: rotating 1.2s linear 0s infinite;
    width: 80px;
    height: 80px;
  }
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
