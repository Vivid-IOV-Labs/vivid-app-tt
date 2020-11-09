<template>
  <i class="icon__svg__wrapper" aria-hidden="true">
    <svg
      fill="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="none"
      class="icon__svg"
      :aria-labelledby="name"
    >
      <title :id="name" lang="en">{{ name }}</title>
      <path v-for="(path, index) in paths" :key="index" :d="path" />
    </svg>
  </i>
</template>
<script>
const icons = {
  request: [
    `M1.315.125A1.823,1.823,0,0,0,.077,1.4C0,1.737,0,3.272,0,7.226v5.383l.211.912c.643,2.466,1.305,3.531,3.627,5.671l.48.451v1.785a13.319,13.319,0,0,0,.1,2.053c.192.537-.192.518,7.2.518h6.717a.739.739,0,0,0,.451-.1c.134-.115.1-.384.1-.384V21.159c0-2.552,0-2.879-.48-3.781A5.287,5.287,0,0,0,16.476,15.4a4.8,4.8,0,0,0-2.428-.595,4.625,4.625,0,0,1-1.094,0c-.163-.086.461-.3.461-.3a5.047,5.047,0,0,0,2.073-2.677,3.675,3.675,0,0,0,.23-1.574A4.865,4.865,0,0,0,15.1,7.677a5.757,5.757,0,0,0-2.034-2.053,4.424,4.424,0,0,0-5.153.844A4.894,4.894,0,0,0,6.4,10.114,5.537,5.537,0,0,0,7.015,12.7a7.388,7.388,0,0,0,1.746,1.823s.518.182.47.259a5.757,5.757,0,0,1-2.149,0,7.254,7.254,0,0,1-2.725-2.313c-.518-.835-.518-.912-.518-6.324-.1-4.971-.1-4.971-.278-5.268A2.082,2.082,0,0,0,2.4.077,1.507,1.507,0,0,0,1.315.125Z`
  ]
};
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    paths() {
      return icons[this.name];
    }
  }
};
</script>
<style>
.icon__svg__wrapper {
  color: inherit;
  display: inline-block;
  height: 100%;
  padding: 0.6em;
  position: relative;
  margin: 0 0.4rem;
}
.icon__svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
