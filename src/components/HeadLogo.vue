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
<style lang="scss">
.head_logo {
  display: flex;
  align-items: center;
  height: 100%;
}
.head_logo__img {
  width: 2rem;
  margin: 0 0 0 0.8rem;
}

.head_logo__beta {
  color: #999;
  font-size: 0.8rem;
  font-weight: 700;
}
@media all and (max-width: 414px) {
  .head_logo__beta {
    display: none;
  }
}
</style>
