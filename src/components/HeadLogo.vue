<template>
  <div class="head_logo">
    <img
      class="head_logo__img"
      src="../assets/img/logopeerkat.png"
      alt="Peerkat Logo"
    />
    <head-menu-right></head-menu-right>
  </div>
</template>
<script>
import HeadMenuRight from "@/components/HeadMenuRight.vue";
export default {
  name: "HeadLogo",
  components: {
    HeadMenuRight
  }
};
</script>
