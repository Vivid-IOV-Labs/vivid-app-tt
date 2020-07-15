<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <!-- <v-ons-button style="background-color: Transparent;">
          <ons-icon
            style="color: #1d1d1b;"
            size="12px"
            icon="fa-bars"
          ></ons-icon>
        </v-ons-button>-->
      </div>
      <div class="center">
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
              >{{ item.label }}</v-ons-list-item>
            </v-ons-list>
          </v-ons-popover>
        </div>
        <!-- <v-ons-segment
          tabbar-id="homeTabbar"
          :index.sync="segmentIndex"
          style="width: 8em"
        >
          <button>List</button>
          <button>Request</button>
        </v-ons-segment>-->
      </div>
      <div class="right">
        <!-- <v-ons-button
          @click="pushToFilterStreamPage"
          style="background-color: Transparent;"
        >
          <ons-icon
            style="color: #1d1d1b;"
            size="12px"
            icon="fa-filter"
          ></ons-icon>
        </v-ons-button>-->
      </div>
    </v-ons-toolbar>

    <!-- <v-ons-tabbar
      id="homeTabbar"
      :tabs="tabs"
      :index.sync="tabbarIndex"
      @push-page="pushToViewStreamPage"
      @push-supply="pushToSupplyStreamPage"
      @back-page="popViewPage"
    ></v-ons-tabbar>-->

    <request-stream
      @push-page="pushToViewStreamPage"
      @push-supply="pushToSupplyStreamPage"
      @back-page="popViewPage"
    ></request-stream>
  </v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
</style>

<script>
import RequestStream from "@/components/RequestStream.vue";

import ListView from "@/components/ListView.vue";
import RequestStreamFilters from "@/components/RequestStreamFilters.vue";

import ViewStream from "@/components/ViewStream.vue";
import SupplyStream from "@/components/SupplyStream.vue";
import { EsriProvider } from "leaflet-geosearch";

const myProvider = new EsriProvider();
export default {
  name: "home",
  components: {
    RequestStream
  },
  data() {
    return {
      autocompleteAdresses: [],
      autocompleteVisible: false,
      selectedAddress: "",
      searchAddress: "",
      tabs: [
        {
          page: ListView,
          key: "ListView"
        },
        {
          page: RequestStream,
          key: "RequestStream"
        }
      ],
      tabbarIndex: 1,
      segmentIndex: 1,
      walletBalance2: 0,
      getSender2: null
    };
  },
  methods: {
    log(...args) {
      console.log(...args);
    },
    pushToFilterStreamPage() {
      this.$emit("push-page", {
        extends: RequestStreamFilters,
        onsNavigatorOptions: {
          animation: "lift",
          animationOptions: {
            duration: 0.5
          }
        }
      });
    },
    pushToViewStreamPage() {
      this.$emit("push-page", ViewStream);
    },
    pushToSupplyStreamPage() {
      this.$emit("push-page", SupplyStream);
    },
    popViewPage() {
      this.$emit("back-page");
    },
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
