<template>
  <v-ons-page id="requestStreamPage">
    <div id="map-container">
      <div id="map"></div>

      <section id="nav_buttons">
        <div class="flex">
          <v-ons-button
            class="btn btn--locate flex-right"
            @click="geolocateMe()"
          >
            <base-icon class="btn__icon" name="location-arrow"></base-icon>
          </v-ons-button>
        </div>
        <div id="pushToViewStreamPageButton">
          <v-ons-button class="btn btn--join" @click="showJoinDialog()">
            <base-icon class="btn__icon" name="users"></base-icon>
          </v-ons-button>
          <v-ons-button class="btn btn--request" @click="showRequestDialog()">
            &nbsp; <base-icon name="request"></base-icon>
          </v-ons-button>
          <v-ons-button class="btn btn--golive" @click="showGoliveDialog()">
            <base-icon class="btn__icon" name="golive"></base-icon>
          </v-ons-button>
        </div>
      </section>
    </div>
    <join-dialog
      @push-viewstream="fromJoin_list"
      v-model="isJoinDialog"
      :markers="joinMarkers"
    ></join-dialog>
    <go-live-dialog
      @push-supplystream="fromSupply_golive"
      v-model="isGoLiveDialog"
      :on-close="geoSearchEvent_golive"
    ></go-live-dialog>
    <request-dialog
      v-model="isRequestDialog"
      :on-close="geoSearchEvent"
    ></request-dialog>
  </v-ons-page>
</template>

<style lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";
@import "@/assets/css/requestStream.scss";
</style>

<script>
import { Icon, Marker, Circle, Map, TileLayer, LatLng } from "leaflet";
import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";
import createOpenLocationCode from "@/util/createOpenLocationCode.js";
import env from "@/env.js";
import { mapMutations, mapActions, mapGetters } from "vuex";
import RequestDialog from "@/components/dialogs/RequestDialog.vue";
import GoLiveDialog from "@/components/dialogs/GoLiveDialog.vue";
import JoinDialog from "@/components/dialogs/JoinDialog.vue";

const io = sailsIOClient(socketIOClient);
io.sails.url = env.web_service_url;

const markerUsers = new Icon({
  iconUrl: require("@/assets/markers/marker-users.svg"),
  iconSize: [55, 80],
  iconAnchor: [13, 63],
  className: "markerUsers",
  popupAnchor: [0, -60]
});
const markerNew = new Icon({
  iconUrl: require("@/assets/markers/marker-new.svg"),
  iconSize: [55, 80],
  iconAnchor: [13, 63],
  className: "markerNew",
  popupAnchor: [0, -60]
});
const markerKfc = new Icon({
  iconUrl: require("@/assets/markers/marker-kfc.png"),
  iconAnchor: [13, 63],
  className: "markerNew",
  popupAnchor: [0, -60]
});
const markerCarabao = new Icon({
  iconUrl: require("@/assets/markers/marker-carabao.png"),
  iconAnchor: [13, 63],
  className: "markerNew",
  popupAnchor: [0, -60]
});
const myProfileIcon = new Icon({
  iconUrl: require("@/assets/markers/marker-profile.svg"),
  iconSize: [38, 95],
  iconAnchor: [28, 40],
  popupAnchor: [-1, -36],
  className: "profilePic"
});

const templateJoin = requestModel => `
      <div>
      <h3>${requestModel.mapPin.details} </h3>
      <p>${requestModel.mapPin.twitterHashTags
        .reduce((acc, tag) => {
          acc += ` #${tag},`;
          return acc;
        }, "")
        .slice(1, -1)}</p>
      <button class="btn btn--join"  id="button-join" type="button">Join</button>
      </div>
      `;
const templateGoLive = (requestModel, isDisabled) => {
  const disabledAttr = isDisabled ? `disabled = "true"` : "";
  return `
    <div>
      <h3>${requestModel.mapPin.details}</h3>
      <p>${requestModel.mapPin.twitterHashTags
        .reduce((acc, tag) => {
          acc += ` #${tag},`;
          return acc;
        }, "")
        .slice(1, -1)}</p>
      <button class="btn btn--golive" ${disabledAttr} id="button-golive" type="button">Go Live</button>
    </div>
    `;
};
const templateDemoStream = () => `
    <div>
      <h3>Start Stream Demo</h3>
      <p>#publisher</p>
      <button class="btn btn--golive" id="button-golive" type="button">Go Live</button>
    </div>
    `;
const templateDemoJoin = () => `
    <div>
      <h3>Join Stream Demo</h3>
      <p>#viewer</p>
      <button  class="btn btn--join" id="button-join" type="button">Join</button>
    </div>
    `;

const allPins = {};
export default {
  name: "requestStream",
  components: {
    RequestDialog,
    JoinDialog,
    GoLiveDialog
  },
  data() {
    return {
      map: null,
      tileLayer: null,
      myLocation: null,
      isRequestDialog: false,
      isGoLiveDialog: false,
      isJoinDialog: false,
      joinMarkers: [],
      requestModel: {
        mapPin: {
          details: "Side view of santa parade",
          twitterHashTags: ["#example1", "#example2"],
          type: "request" //golive
        },
        user: {
          walletAddress: this._myWalletAddress()
        },
        location: null,
        streamer: {
          live: false,
          walletAddress: null
        },
        openLocationCode: null,
        statistics: {
          totalNumberOfViewers: 0,
          totalNumberOfFlags: 0
        }
      }
    };
  },
  watch: {
    searchLocation: {
      handler: function(val) {
        this.map.setView([val.y, val.x], 15);
      },
      deep: true
    }
  },
  computed: {
    searchLocation() {
      return this.$store.state.searchLocation;
    },
    ...mapGetters({
      myPosition: "getPosition"
    })
  },
  methods: {
    ...mapMutations({
      _setLocalCopyOfRequestPins: "setLocalCopyOfRequestPins",
      _setSelectedPin: "setSelectedPin",
      _setStreamerWalletAddress: "setStreamerWalletAddress"
    }),
    ...mapActions({
      _find_all_requests: "find_all_requests",
      _add: "add",
      _get_requests: "get_requests",
      _create: "create",
      _updateRequestModel: "update",
      _updateAddress: "updateAddress"
    }),
    ...mapGetters({
      _myWalletAddress: "myWalletAddress",
      _getLocalCopyOfRequestPins: "getLocalCopyOfRequestPins",
      _getSelectedPin: "getSelectedPin",
      _getStreamerWalletAddress: "getStreamerWalletAddress"
    }),
    addMarkersLoop(markers) {
      for (var i = 0; i < markers.length; i++) {
        var lat = markers[i].location.y;
        var lon = markers[i].location.x;
        const marker = markers[i];
        const pin = new Marker(
          { lon, lat },
          {
            icon: marker.streamer.live ? markerUsers : markerNew
          }
        );
        const isDisabled = !marker.streamer.live && this.isDisabled(pin);

        if (allPins[marker.openLocationCode]) {
          this.removePin(marker.openLocationCode);
        }

        allPins[marker.openLocationCode] = pin;
        this.map.addLayer(pin);

        pin
          .bindPopup(
            marker.streamer.live
              ? templateJoin(marker)
              : templateGoLive(marker, isDisabled),
            {
              maxWidth: 1060
            }
          )
          .on("popupopen", () => {
            if (marker.streamer.live) {
              document
                .getElementById("button-join")
                .addEventListener("click", () => {
                  this.fromJoin();
                });
            } else {
              document
                .getElementById("button-golive")
                .addEventListener("click", () => {
                  if (isDisabled) {
                    return;
                  }
                  this.fromSupply();
                });
            }
          })
          .on("click", e => {
            const locationcode = createOpenLocationCode({
              lon: e.latlng.lng,
              lat: e.latlng.lat
            });

            const localPins = this._getLocalCopyOfRequestPins();
            let obj = localPins.find(obj => {
              return obj.openLocationCode === locationcode;
            });
            this._setSelectedPin(obj);
          });
        const opacity = isDisabled ? 0.6 : 1;
        pin.setOpacity(opacity);
      }
    },
    fromJoin_list(_str) {
      let obj = this._getLocalCopyOfRequestPins().find(
        obj => obj.openLocationCode === _str
      );

      this._setSelectedPin(obj);
      this._setStreamerWalletAddress(obj.streamer.walletAddress);

      this.pushToViewStreamPage();
    },
    fromJoin() {
      this.map.closePopup();
      const selectedPin = this._getSelectedPin();
      if (selectedPin) {
        this._setStreamerWalletAddress(selectedPin.streamer.walletAddress);

        this.pushToViewStreamPage();
      }
    },
    fromSupply_golive() {
      let selectedPin = this._getSelectedPin();

      selectedPin.streamer.walletAddress = this._myWalletAddress();

      this._setSelectedPin(selectedPin);

      this.pushToSupplyStreamPage();
    },
    async fromSupply() {
      this.map.closePopup();
      let selectedPin = this._getSelectedPin();
      selectedPin.streamer.walletAddress = this._myWalletAddress();

      this._setSelectedPin(selectedPin);
      this._updateAddress({
        streamName: selectedPin.openLocationCode,
        address: selectedPin.streamer.walletAddress
      });

      this.pushToSupplyStreamPage();
    },
    fromRequest() {
      const selectedPin = this._getSelectedPin();
      if (selectedPin) {
        this._setStreamerWalletAddress(selectedPin.streamer.walletAddress);

        this.pushToViewStreamPage();
      }
    },
    showRequestDialog() {
      this.isRequestDialog = true;
    },
    showGoliveDialog() {
      this.isGoLiveDialog = true;
    },
    showJoinDialog() {
      this.isJoinDialog = true;
    },
    pushToViewStreamPage() {
      this.$emit("push-page");
    },
    pushToSupplyStreamPage() {
      this.$emit("push-supply");
    },

    geoSearchEvent_golive(_data) {
      this.requestModel.mapPin = _data.mapPin;

      this.requestModel.mapPin.twitterHashTags = _data.mapPin.twitterHashTags;

      this.requestModel.location = _data.location;
      this.requestModel.openLocationCode = _data.openLocationCode;

      this.requestModel.user.walletAddress = _data.user.walletAddress;
      this.requestModel.streamer.walletAddress = _data.user.walletAddress;

      this._create(JSON.parse(JSON.stringify(this.requestModel)));

      this.addMarkersLoop([this.requestModel]);

      this.map.setView([_data.location.y, _data.location.x], 15);
    },
    geoSearchEvent(_data) {
      // Encode a location, default accuracy: var code = openLocationCode.encode(47.365590, 8.524997); devLog(code);
      // Encode a location using one stage of additional refinement:
      //#encode(latitude, longitude, code_length = PAIR_CODE_LENGTH) ⇒ String
      const code = createOpenLocationCode({
        lon: _data.location.x,
        lat: _data.location.y
      });

      this.requestModel.mapPin = _data.mapPin;

      this.requestModel.location = _data.location;
      this.requestModel.openLocationCode = code;
      this._create(JSON.parse(JSON.stringify(this.requestModel)));

      this.addMarkersLoop([this.requestModel]);

      this.map.setView([_data.location.y, _data.location.x], 15);
    },
    geolocateMe() {
      this.map.locate();
    },
    onLocationFound(e) {
      const radius = e.accuracy;
      new Marker(e.latlng, {
        icon: myProfileIcon
      })
        .addTo(this.map)
        .bindPopup("You are here")
        .openPopup();
      new Circle(e.latlng, radius).addTo(this.map);
    },
    onLocationError(e) {
      this.$ons.notification.alert(e.message);

      this.map.setView([51.520748, -0.08504], 15);
    },
    initMap() {
      this.map = new Map("map").setView([51.520748, -0.08504], 15);
    },
    initLayers() {
      this.tileLayer = new TileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWEwNnJpaSIsImEiOiJjazZkeTU2NnAxbWF4M2xxajN6NWIyb2l6In0.4iTjEpS8cIa_Um3zhE9keQ",
        {
          attribution: false,
          maxZoom: 36,
          id: "mapbox/streets-v11"
        }
      ).addTo(this.map);
    },
    removePin(openLocationCode) {
      const markerToRemove = allPins[openLocationCode];
      markerToRemove.removeFrom(this.map);
    },
    isDisabled(pin) {
      if (!this.myPosition) return true;
      const {
        coords: { latitude: lat, longitude: lon }
      } = this.myPosition;
      const myPosition = new Marker({ lon, lat });

      const distanceInKm =
        pin
          .getLatLng()
          .distanceTo(myPosition.getLatLng())
          .toFixed(0) / 1000;
      const rangeInKm = 25;
      return distanceInKm > rangeInKm;
    }
  },
  beforeCreate() {
    this.$store.dispatch("registerWeb3");
  },
  async mounted() {
    io.socket.on("request-created", msg => {
      if (msg.data) {
        this.addMarkersLoop([msg.data]);

        var localCopyOfRequestPins = this._getLocalCopyOfRequestPins();
        if (localCopyOfRequestPins) {
          localCopyOfRequestPins.forEach((element, index) => {
            if (element.openLocationCode === msg.data.openLocationCode) {
              localCopyOfRequestPins[index] = Object.assign(
                {},
                localCopyOfRequestPins[index],
                msg.data
              );

              if (msg.data.streamer.live == true) {
                this.joinMarkers.push(localCopyOfRequestPins[index]);
              }

              this._setLocalCopyOfRequestPins(localCopyOfRequestPins);
            }
          });
        } else {
          this._setLocalCopyOfRequestPins([msg.data]);

          if (msg.data.streamer.live == true) {
            this.joinMarkers.push(msg.data);
          }
        }

        if (msg.verb == "created") {
          if (localCopyOfRequestPins) {
            localCopyOfRequestPins.push(msg.data);
            this._setLocalCopyOfRequestPins(localCopyOfRequestPins);
          } else {
            this._setLocalCopyOfRequestPins([msg.data]);
          }

          if (msg.data.streamer.live == true) {
            this.joinMarkers.push(msg.data);
          }
        }
      }
    });

    io.socket.get("/request/list", async resData => {
      if (resData && resData.length) {
        this.joinMarkers = resData.filter(markers => markers.streamer.live);
        await this._setLocalCopyOfRequestPins(resData);
        this.addMarkersLoop(resData);
      }
    });
    io.socket.on("request-deleted-flag-reported", resData => {
      this.map.whenReady(() => {
        this.$nextTick(() => {
          this.removePin(resData.data.openLocationCode);
          let arrrayOfLayerIDsToRemove = [];
          for (const property in this.map._layers) {
            if (this.map._layers[property]._latlng) {
              if (
                resData.data.location.x ==
                  this.map._layers[property]._latlng.lng &&
                resData.data.location.y ==
                  this.map._layers[property]._latlng.lat
              ) {
                arrrayOfLayerIDsToRemove.push(property);
              }
            }
          }
        });
      });
    });
    io.socket.on("livestreamended", resData => {
      if (resData.data) {
        let arrrayOfLayerIDsToRemove = [];
        for (const property in this.map._layers) {
          if (this.map._layers[property]._latlng) {
            if (
              resData.data.location.x ==
                this.map._layers[property]._latlng.lng &&
              resData.data.location.y == this.map._layers[property]._latlng.lat
            ) {
              arrrayOfLayerIDsToRemove.push(property);
            }
          }
        }
        arrrayOfLayerIDsToRemove.forEach(id => {
          this.map._layers[id].remove();
        });
        this.joinMarkers = this.joinMarkers.filter(
          markers => markers.openLocationCode != resData.data.openLocationCode
        );
        let localCopyOfRequestPins = this._getLocalCopyOfRequestPins();
        localCopyOfRequestPins = localCopyOfRequestPins.filter(
          markers => markers.openLocationCode != resData.data.openLocationCode
        );
        this._setLocalCopyOfRequestPins(localCopyOfRequestPins);
      }
    });

    this.initMap();

    this.initLayers();

    var london = new LatLng(51.5056, -0.1213);

    this.map.setView(london, 13);
    var markers = [
      [-0.1244324, 51.5006728, "Big Ben", "streamTest"],
      [-0.0963224, 51.5049318, "KFC", "kfc"],
      [-0.1433256, 51.502528, "Carabao", "carabao"],
      [-0.1094099, 51.50176, "Location", "joinTest"]
    ];

    for (var i = 0; i < markers.length; i++) {
      var lon = markers[i][0];
      var lat = markers[i][1];
      var iconType = markers[i][3];

      var marker = new Marker(
        { lon, lat },
        {
          icon:
            iconType == "new" || iconType == "streamTest"
              ? markerNew
              : iconType == "joinTest"
              ? markerUsers
              : iconType == "kfc"
              ? markerKfc
              : markerCarabao
        }
      );
      this.map.addLayer(marker);
      if (iconType == "streamTest") {
        marker.bindPopup(templateDemoStream(marker), {
          maxWidth: 1060
        });
      }
      if (iconType == "joinTest") {
        marker.bindPopup(templateDemoJoin(marker), {
          maxWidth: 1060
        });
      }
    }

    this.map.on("locationfound", this.onLocationFound);

    this.map.on("locationerror", this.onLocationError);
  }
};
</script>
