<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <span>
          <img
            style="margin: 0 0.8rem"
            width="30"
            src="../img/logopeerkat.png"
            alt=""
          />
          <span
            style="    color: #999;
    font-size: 0.8rem;
    font-weight: 700;"
            >BETA</span
          >
        </span>
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
                >{{ item.label }}</v-ons-list-item
              >
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
        <v-ons-toolbar-button @click="showPopover">
          <v-ons-icon
            style="color:#fff"
            class="btn__icon"
            icon="fa-bars"
          ></v-ons-icon>
        </v-ons-toolbar-button>
        <v-ons-popover
          cancelable
          :visible.sync="popoverVisible"
          :target="popoverTarget"
          :direction="popoverDirection"
          :cover-target="coverTarget"
          style="z-index: 99999; text-align:center"
        >
          <h6 class="text-center">Peerkat <small>BETA</small></h6>
          <v-ons-list class="text-center">
            <v-ons-list-item class="text-center" modifier="tappable"
              >User Guide</v-ons-list-item
            >
            <v-ons-list-item class="text-center" modifier="tappable"
              >User Policy</v-ons-list-item
            >
            <v-ons-list-item class="text-center" modifier="tappable"
              >Report Bug</v-ons-list-item
            >
            <v-ons-list-item class="text-center" modifier="tappable"
              >Customer Support</v-ons-list-item
            >
          </v-ons-list>
          <div class="flex justify-center">
            <v-ons-button class="btn btn--default">
              <v-ons-icon class="btn__icon" icon="fa-twitter"></v-ons-icon>
            </v-ons-button>
            <v-ons-button class="btn btn--default">
              <v-ons-icon class="btn__icon" icon="fa-telegram"></v-ons-icon>
            </v-ons-button>
          </div>
          <small class="text-center"
            >© 2020 Peerkat. All rights reserved.
          </small>
        </v-ons-popover>
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
      @push-broadcast="pushToBroadcaster"
      @push-stream="pushToStreamer"
      @push-page="pushToViewStreamPage"
      @push-supply="pushToSupplyStreamPage"
      @back-page="popViewPage"
    ></request-stream>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
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
import Streamer from "@/components/Streamer.vue";
import Broadcaster from "@/components/Broadcaster.vue";
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
      popoverVisible: false,
      popoverTarget: null,
      popoverDirection: "up",
      coverTarget: false,
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
    showPopover(event, direction, coverTarget = false) {
      this.popoverTarget = event;
      this.popoverDirection = direction;
      this.coverTarget = coverTarget;
      this.popoverVisible = true;
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
    pushToStreamer() {
      this.$emit("push-page", Streamer);
    },
    pushToBroadcaster() {
      this.$emit("push-page", Broadcaster);
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
<style>
.justify-center {
  justify-content: center;
}
.text-center {
  text-align: center!;
}
.list-item__center {
  justify-content: center;
}
.popover {
  padding: 1rem;
}
</style>
