<template>
  <div class="onboarding-page">
    <div class="onboarding-page--enter logo-page">
      <img class="logo-page__img" src="@/assets/img/logopeerkat.png" />
      <button class="btn btn--large btn--request" @click="endOnBoarding">
        ENTER PLANET PEERKAT
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnterPeerkat",
  props: {
    endOnBoarding: {
      type: Function,
      required: true
    }
  }
};
</script>
