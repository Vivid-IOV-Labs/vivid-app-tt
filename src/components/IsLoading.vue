<template>
  <transition name="fade">
    <div v-if="isStillLoading" class="isloading flex-center-xy">
      <img class="isloading__img" src="@/assets/img/loading.png" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: function() {
    return {
      isStillLoading: false
    };
  },
  computed: {
    ...mapGetters("uistates", ["isLoading"])
  },
  watch: {
    isLoading(newValue) {
      if (newValue) {
        const checkIfStillLoading = setTimeout(() => {
          clearTimeout(checkIfStillLoading);
          if (this.isLoading) {
            this.isStillLoading = true;
          }
        }, 800);
      } else {
        this.isStillLoading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.isloading {
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
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
.fade-enter-active {
  transition: opacity 0.4s;
}
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
