<template functional>
  <span class="head_logo">
    <img
      class="head_logo__img"
      src="../assets/img/logopeerkat.png"
      alt="Peerkat Logo"
    />
    <span class="head_logo__beta">BETA</span>
  </span>
</template>
<script>
export default {
  name: "HeadLogo"
};
</script>
<style>
.head_logo {
  display: inline-flex;
  align-items: center;
}
.head_logo__img {
  width: 2rem;
  margin: 0 0.8rem;
}

.head_logo__beta {
  color: #999;
  font-size: 0.8rem;
  font-weight: 700;
}
</style>
