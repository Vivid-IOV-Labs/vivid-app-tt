<template>
  <svg
    class="icon"
    :class="{ 'icon-spin': spin, 'icon--fill': fill, 'icon--not-fill': !fill }"
  >
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<script>
export default {
  name: "BaseIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    spin: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss">
svg {
  pointer-events: none;
}
svg.icon {
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
  width: 1em;
  pointer-events: none;
}
svg.icon--fill {
  fill: currentColor;
  stroke: none;
}
svg.icon--not-fill {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}
svg.icon-spin {
  animation: icon-spin 2s infinite linear;
}
@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
