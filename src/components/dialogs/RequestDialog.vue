<template>
  <v-ons-dialog cancelable :visible="value" @update:visible="updateVisible">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">Request A Stream</div>
        <div class="right">
          <v-ons-button class="btn_close" @click="close">
            <base-icon class="btn__icon--white" name="times"></base-icon>
          </v-ons-button>
        </div>
      </v-ons-toolbar>
      <v-ons-list>
        <v-ons-list-item>
          <div class="flex-coulumn p-4">
            <textarea
              title="Request Title"
              class="textarea textarea--transparent"
              placeholder="What do you want to see?"
              v-model="requestModel.mapPin.details"
            >
            </textarea>
            <small>[10 words max]</small>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="flex-coulumn p-4">
            <geo-search-bar
              id="request_location"
              title="Search"
              placeholder="Add Location"
              @change="onSelectAddress"
            ></geo-search-bar>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="flex-coulumn p-4">
            <v-ons-list>
              <div>
                <v-ons-list-item>
                  <span>#</span
                  ><v-ons-input
                    title="Add Hashtags"
                    v-model="requestModel.mapPin.twitterHashTags[0]"
                    placeholder="Add Hashtag"
                    float
                  >
                  </v-ons-input>
                </v-ons-list-item>
                <v-ons-list-item>
                  <span>#</span
                  ><v-ons-input
                    title="Add Hashtags"
                    v-model="requestModel.mapPin.twitterHashTags[1]"
                    placeholder="Add Hashtag "
                  >
                  </v-ons-input>
                </v-ons-list-item>
                <v-ons-list-item>
                  <span>#</span
                  ><v-ons-input
                    title="Add Hashtags"
                    v-model="requestModel.mapPin.twitterHashTags[2]"
                    placeholder="Add Hashtag "
                  >
                  </v-ons-input>
                </v-ons-list-item>
              </div>
            </v-ons-list>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <div class="flex-center-xy p-2">
        <v-ons-button
          class="btn btn--request btn--full btn--large"
          @click="closeRequestDialog"
        >
          Confirm
          <base-icon name="request"></base-icon>
        </v-ons-button>
      </div>
    </v-ons-page>
  </v-ons-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import GeoSearchBar from "@/components/GeoSearchBar.vue";

export default {
  name: "RequestDialog",
  components: {
    GeoSearchBar
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
  data() {
    return {
      requestModel: {
        mapPin: {
          details: "",
          twitterHashTags: [],
          type: "request"
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
    closeRequestDialog() {
      if (this.requestModel.location) {
        this.onClose(this.requestModel);

        this.$emit("input", false);
      }
    },
    onSelectAddress(address) {
      this.requestModel.location = address;
    }
  }
};
</script>
