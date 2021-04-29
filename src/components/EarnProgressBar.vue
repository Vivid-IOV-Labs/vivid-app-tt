<template>
  <div>
    <div class="progress_wrapper">
      <span
        :class="{
          'progress_bar--azure': completed,
          'progress_bar--white': !completed
        }"
        class="progress_bar"
        :style="{ width: `${percentage}%` }"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number
    },
    completed: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.progress_wrapper {
  height: 0.8rem;
  width: 100%;
  position: relative;
  background: #222;
  border-radius: 0.8rem;
  padding: 0.2rem;
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.1);
}
.progress_wrapper > .progress_bar {
  display: block;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.progress_bar--white {
  background-color: $white;
}
.progress_bar--azure {
  background-color: $azure;
}
</style>
