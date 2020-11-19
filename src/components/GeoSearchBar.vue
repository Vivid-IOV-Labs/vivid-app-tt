<template>
  <div>
    <v-ons-search-input
      :id="id"
      :placeholder="placeholder"
      v-model="searchAddress"
      @input="onSearchAddress"
      @click="selectInputText"
    ></v-ons-search-input>
    <v-ons-popover
      :target="`#${id}`"
      :visible="autocompleteVisible && popover"
      direction="down"
      cancelable
      v-if="popover"
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
    <v-ons-list v-if="autocompleteVisible && !popover">
      <v-ons-list-item
        v-for="item in autocompleteAdresses"
        :key="item.label"
        @click="onSelectAddress(item)"
        modifier="tappable"
        >{{ item.label }}</v-ons-list-item
      >
    </v-ons-list>
  </div>
</template>

<script>
import { OpenStreetMapProvider } from "leaflet-geosearch";

const myProvider = new OpenStreetMapProvider({
  params: {
    email: "peerkat@gmail.com",
    limit: 2,
    zoom: 6
  }
});
export default {
  name: "GeoSearchBar",
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    popover: {
      type: Boolean,
      default: false
    }
  },
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
      this.$emit("change", address);
    },
    onSearchAddress(event) {
      const autcompleteSearch = async () => {
        const results = await myProvider.search({ query: event.target.value });
        this.autocompleteAdresses = results;
        this.autocompleteVisible = true;
      };
      setTimeout(autcompleteSearch, 200);
    },
    selectInputText(event) {
      event.target.setSelectionRange(0, this.searchAddress.length);
    }
  }
};
</script>
