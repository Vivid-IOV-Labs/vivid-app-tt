<template>
  <div>
    <button id="go-button">Go</button>
  </div>
</template>

<style></style>

<script>
export default {
  name: "main_page",
  data() {
    return {};
  },
  methods: {
    pushToViewStreamPage() {
      console.log("go done");
      this.$emit("push-page");
    }
  }
};
</script>
