<template>
  <geo-search-bar
    id="search"
    class="mt-2"
    title="Search"
    placeholder="Search Location"
    @change="onSelectAddress"
    :popover="true"
  ></geo-search-bar>
</template>

<script>
import GeoSearchBar from "@/components/GeoSearchBar.vue";

export default {
  components: {
    GeoSearchBar
  },
  methods: {
    onSelectAddress(address) {
      this.$store.dispatch("newSearchLocation", address);
    }
  }
};
</script>
