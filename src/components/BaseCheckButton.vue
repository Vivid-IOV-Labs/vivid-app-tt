<template>
  <v-ons-button
    class="btn btn-check btn--round-large text-azure btn--opacity-soft nd mb-4"
    role="checkbox"
    :checked="selected"
    :aria-checked="selected"
    :aria-label="text"
    :class="{ 'btn-check--selected': selected }"
    tabindex="0"
    @click="check"
  >
    <slot></slot>
  </v-ons-button>
</template>

<script>
export default {
  name: "BaseCheckButton",
  props: {
    text: {
      type: String,
      default: ""
    },
    value: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: Infinity
    }
  },
  methods: {
    check() {
      const value = this.selected
        ? this.value.filter(name => name !== this.name)
        : [...this.value, this.name];

      const { length } = value;
      const last = length >= 2 ? value[length - 2] : value[length - 1];
      const limitedValue =
        length > this.limit ? value.filter(name => name !== last) : value;
      this.$emit("input", limitedValue);
    }
  }
};
</script>

<style lang="scss">
.btn-check.btn-check--selected {
  border: 2px solid $azure;
}
.btn-check:hover {
  background: $dark-grey;
  color: $azure;
}
.btn-check {
  background: $dark-grey;
  color: $azure;
  border: 2px solid $dark-grey;
}
</style>
