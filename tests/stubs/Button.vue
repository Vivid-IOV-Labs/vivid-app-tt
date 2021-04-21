<template>
  <button @click="callback">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    callback() {
      this.$emit("click");
    }
  }
};
</script>
