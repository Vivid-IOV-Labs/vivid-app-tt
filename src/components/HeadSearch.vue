<template>
  <div style="display:flex;flex-direction:column; padding:0.4rem 0 0">
    <v-ons-search-input
      id="search"
      placeholder="Search Location"
      v-model.lazy="searchAddress"
      @input="onSearchAddress"
    ></v-ons-search-input>
    <v-ons-popover
      style="z-index:99999999;
  transform: translate(2%,-20%);"
      target="#search"
      :visible="autocompleteVisible"
      cancelable
    >
      <v-ons-list>
        <v-ons-list-item
          v-for="item in autocompleteAdresses"
          :key="item.label"
          @click="onSelectAddress(item)"
          modifier="tappable"
          >{{ item.label }}</v-ons-list-item
        >
      </v-ons-list>
    </v-ons-popover>
  </div>
</template>

<script>
import { OpenStreetMapProvider } from "leaflet-geosearch";

const myProvider = new OpenStreetMapProvider();
/* eslint-disable no-undef */
export default {
  name: "HeadSearch",
  data() {
    return {
      autocompleteAdresses: [],
      autocompleteVisible: false,
      selectedAddress: "",
      searchAddress: ""
    };
  },
  methods: {
    onSelectAddress(address) {
      this.searchAddress = address.label;
      this.autocompleteVisible = false;
      this.$store.dispatch("newSearchLocation", address);
    },
    onSearchAddress(event) {
      const autcompleteSearch = async () => {
        const results = await myProvider.search({ query: event.target.value });
        this.autocompleteAdresses = results;
        this.autocompleteVisible = true;
      };
      setTimeout(autcompleteSearch, 200);
    }
  }
};
</script>
