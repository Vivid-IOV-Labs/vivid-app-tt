<template>
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
          v-model="searchAddress"
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
            ><a class="menu__link" href="#" @click="toOnboarding">
              User Guide
            </a>
          </v-ons-list-item>
          <v-ons-list-item class="text-center" modifier="tappable"
            ><a
              class="menu__link"
              href="https://www.vividiov.com/terms"
              target="_blank"
            >
              User Terms
            </a>
          </v-ons-list-item>
          <v-ons-list-item class="text-center" modifier="tappable"
            ><a
              class="menu__link"
              href="https://www.vividiov.com/privacy"
              target="_blank"
            >
              Privacy Policy
            </a></v-ons-list-item
          >
          <v-ons-list-item class="text-center" modifier="tappable"
            ><a
              class="menu__link"
              href="mailto:info@vividiov.com?subject=Report Bug"
              target="_blank"
            >
              Report Bug
            </a></v-ons-list-item
          >
          <v-ons-list-item class="text-center" modifier="tappable"
            ><a
              class="menu__link"
              href="mailto:info@vividiov.com?subject=Customer Support"
              target="_blank"
            >
              Customer Support
            </a></v-ons-list-item
          >
        </v-ons-list>
        <div class="flex justify-center">
          <a
            href="https://twitter.com/PeerkatLive"
            target="_blank"
            class="btn btn--default"
          >
            <v-ons-icon class="btn__icon" icon="fa-twitter"></v-ons-icon>
          </a>
          <a
            href="https://t.me/joinchat/M90RPBklSbAkMzfLl02Qcw"
            target="_blank"
            class="btn btn--default"
          >
            <v-ons-icon class="btn__icon" icon="fa-telegram"></v-ons-icon>
          </a>
        </div>
        <small class="text-center">© 2020 Peerkat. All rights reserved. </small>
      </v-ons-popover>
    </div>
  </v-ons-toolbar>
</template>

<script>
import { OpenStreetMapProvider } from "leaflet-geosearch";

const myProvider = new OpenStreetMapProvider();
export default {
  name: "Header",
  data() {
    return {
      autocompleteAdresses: [],
      autocompleteVisible: false,
      selectedAddress: "",
      searchAddress: "",
      popoverVisible: false,
      popoverTarget: null,
      popoverDirection: "up"
    };
  },
  methods: {
    showPopover(event, direction, coverTarget = false) {
      this.popoverTarget = event;
      this.popoverDirection = direction;
      this.coverTarget = coverTarget;
      this.popoverVisible = true;
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

<style lang="scss" scoped></style>
