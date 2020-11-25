<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">About my Live Stream</div>
        <div class="right">
          <v-ons-button class="btn_close" @click="close">
            <base-icon class="btn__icon--white" name="times"></base-icon>
          </v-ons-button>
        </div>
      </v-ons-toolbar>
      <div class="scroller">
        <v-ons-list>
          <v-ons-list-item>
            <div class="flex-column p-4 full-width ">
              <textarea
                title="Stream Title"
                class="textarea textarea--transparent"
                placeholder="What is the live Stream about?"
                v-model="requestModel.mapPin.details"
              ></textarea>
              <small>[10 words max]</small>
            </div>
          </v-ons-list-item>
          <v-ons-list-item>
            <div class="flex-column p-4 full-width">
              <geo-search-bar
                id="golive_location"
                title="Search"
                placeholder="Add Location"
                @change="onSelectAddress"
              ></geo-search-bar>
            </div>
          </v-ons-list-item>
          <v-ons-list-item>
            <div class="flex-column p-4 full-width">
              <v-ons-list>
                <div>
                  <v-ons-list-item>
                    <span>#</span>
                    <v-ons-input
                      class="flex-stretch"
                      title="Add Hashtags"
                      v-model="requestModel.mapPin.twitterHashTags[0]"
                      placeholder="Add Hashtags"
                      float
                    ></v-ons-input>
                  </v-ons-list-item>
                  <v-ons-list-item>
                    <span>#</span>
                    <v-ons-input
                      class="flex-stretch"
                      title="Add Hashtags"
                      v-model="requestModel.mapPin.twitterHashTags[1]"
                      placeholder="Add Hashtags"
                    ></v-ons-input>
                  </v-ons-list-item>
                  <v-ons-list-item>
                    <span>#</span>
                    <v-ons-input
                      class="flex-stretch"
                      title="Add Hashtags"
                      v-model="requestModel.mapPin.twitterHashTags[3]"
                      placeholder="Add Hashtags"
                    ></v-ons-input>
                  </v-ons-list-item>
                </div>
              </v-ons-list>
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <div class="flex-center-xy p-2">
          <v-ons-button
            class="btn btn--golive btn--full btn--large"
            @click="closeGoLiveDialog"
          >
            Confirm
            <base-icon class="btn__icon" name="video"></base-icon>
          </v-ons-button>
        </div>
      </div>
    </v-ons-page>
  </v-ons-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import GeoSearchBar from "@/components/GeoSearchBar.vue";

import createOpenLocationCode from "@/util/createOpenLocationCode.js";

export default {
  name: "GoLiveDialog",
  components: {
    GeoSearchBar
  },
  data() {
    return {
      requestModel: {
        mapPin: {
          details: "",
          twitterHashTags: [],
          type: "golive"
        },
        location: null,
        user: {
          walletAddress: null
        },
        streamer: {
          live: false,
          walletAddress: null
        },
        openLocationCode: null
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
    ...mapMutations({
      _setSelectedPin: "setSelectedPin"
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
      this.requestModel.location = address;

      this.requestModel.openLocationCode = createOpenLocationCode({
        lon: address.x,
        lat: address.y
      });

      this.requestModel.user.walletAddress = this._myWalletAddress();
      this.requestModel.streamer.walletAddress = this._myWalletAddress();

      this._setSelectedPin(this.requestModel);
    },
    pushToSupplyStreamPage() {
      this.$emit("input", false);

      this.$emit("push-supplystream");
    }
  }
};
</script>
