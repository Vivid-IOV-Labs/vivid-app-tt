<template>
  <div>
    <BaseIconSprite />
    <RouterWrapper />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source Code Pro");

@import "assets/css/app.scss";
body {
  font-family: "Source Code Pro";
}
.page__background {
  background: lighten($color: $dark-grey, $amount: 15);
}

.page__content {
  background: lighten($color: $dark-grey, $amount: 15);
  color: $white;
}
.bottom-bar,
.toolbar {
  background-image: none;
  background: $dark-grey;
}
</style>

<script>
import BaseIconSprite from "@/components/BaseIconSprite.vue";
import RouterWrapper from "@/components/RouterWrapper.vue";
export default {
  name: "main_page",
  components: {
    BaseIconSprite,
    RouterWrapper
  }
};
</script>
