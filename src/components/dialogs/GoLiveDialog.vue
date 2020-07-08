<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    GoLive Dialog POP Up
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">About my Live Stream</div>
        <div class="right">
          <v-ons-button
            style="float:right; box-shadow:none; background:transparent; border:none"
            @click="close"
          >
            <v-ons-icon class="btn__icon--white" icon="fa-times"></v-ons-icon>
          </v-ons-button>
        </div>
      </v-ons-toolbar>
      <v-ons-list>
        <v-ons-list-item>
          <div style="display:flex;flex-direction:column; padding:1rem">
            <label for="">Stream Title</label>
            <textarea
              class="textarea textarea--transparent"
              placeholder="What do you want to watch?"
              v-model="requestModel.mapPin.details"
            >
            </textarea>
            <small>[10 words max]</small>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div style="display:flex;flex-direction:column; padding:1rem">
            <label for="">Add Hashtags</label>
            <v-ons-list>
              <div>
                <v-ons-list-item>
                  <span>#</span
                  ><v-ons-input placeholder="What do you want to watch?" float>
                  </v-ons-input>
                </v-ons-list-item>
                <v-ons-list-item>
                  <span>#</span
                  ><v-ons-input placeholder="What do you want to watch? ">
                  </v-ons-input>
                </v-ons-list-item>
                <v-ons-list-item>
                  <span>#</span
                  ><v-ons-input placeholder="What do you want to watch? ">
                  </v-ons-input>
                </v-ons-list-item>
              </div>
            </v-ons-list>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div style="display:flex;flex-direction:column; padding:1rem">
            <label for="">Add Location</label>
            <v-ons-search-input
              id="search"
              style="width:100%"
              placeholder="Search something"
              v-model.lazy="searchAddress"
              @input="onSearchAddress"
            ></v-ons-search-input>
            <!-- <v-ons-popover
              :cover-target="false"
              target="#search"
              :visible="autocompleteVisible"
              cancelable
              direction="up"
            > -->
            <v-ons-list v-if="autocompleteVisible">
              <v-ons-list-item
                v-for="item in autocompleteAdresses"
                :key="item.label"
                @click="onSelectAddress(item)"
                modifier="tappable"
              >
                {{ item.label }}
              </v-ons-list-item>
            </v-ons-list>
            <!-- </v-ons-popover> -->
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <v-ons-button
        style="width: 90%;
            display: block;
            border-radius:0.3rem;
            margin: 1rem auto;
            text-align: center;
            padding: 0.6rem 1rem;
            background: #F73E2D;
            font-weight:550;
            color: #fff;"
        @click="closeGoLiveDialog"
      >
        Confirm
      </v-ons-button>
    </v-ons-page>
  </v-ons-dialog>
</template>

<script>
import { EsriProvider } from "leaflet-geosearch";
import { mapGetters } from "vuex";

const myProvider = new EsriProvider();
export default {
  name: "GoLiveDialog",
  data() {
    return {
      autocompleteAdresses: [],
      autocompleteVisible: false,
      selectedAddress: "",
      searchAddress: "",
      requestModel: {
        mapPin: {
          details: "",
          twitterHashTags: [],
          type: "golive"
        },
        location: null,
        user: {
          walletAddress: this._myWalletAddress()
        },
        streamer: {
          live: false,
          walletAddress: null
        }
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    onClose: {
      type: Function,
      default: () => Promise.resolve
    }
  },
  methods: {
    ...mapGetters({
      _myWalletAddress: "myWalletAddress"
    }),
    updateVisible(value) {
      this.$emit("input", value);
    },
    close() {
      this.$emit("input", false);
    },
    closeGoLiveDialog() {
      if (this.requestModel.location) {
        this.onClose(this.requestModel);

        this.$emit("input", false);
        this.pushToSupplyStreamPage();
      }
    },
    onSelectAddress(address) {
      this.searchAddress = address.label;
      this.requestModel.location = address;
      this.autocompleteVisible = false;
    },
    onSearchAddress(event) {
      const autcompleteSearch = async () => {
        const results = await myProvider.search({ query: event.target.value });
        this.autocompleteAdresses = results;
        this.autocompleteVisible = true;
      };
      setTimeout(autcompleteSearch, 200);
    },
    pushToSupplyStreamPage() {
      this.$emit("input", false);

      this.$emit("push-supplystream");
    }
  }
};
</script>

<style lang="scss" scoped></style>
