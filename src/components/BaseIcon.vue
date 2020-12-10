<template>
  <svg class="icon" :class="{ 'icon-spin': spin }">
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
    }
  }
};
</script>

<style lang="scss">
svg.icon {
  fill: currentColor;
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
  width: 1em;
  pointer-events: none;
}
svg.icon--fill {
  fill: currentColor;
}
svg.icon--notfill {
  fill: none;
  stroke: currentColor;
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
