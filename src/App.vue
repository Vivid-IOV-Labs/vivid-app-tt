<template>
  <div>
    <IsLoading />
    <BaseIconSprite />
    <RouterWrapper />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

@import "assets/css/app.scss";
body {
  font-family: "Prompt", sans-serif !important;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Source Code Pro", sans-serif !important;
  font-weight: bold;
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
import IsLoading from "@/components/IsLoading.vue";
export default {
  name: "main_page",
  components: {
    BaseIconSprite,
    IsLoading,
    RouterWrapper
  }
};
</script>
