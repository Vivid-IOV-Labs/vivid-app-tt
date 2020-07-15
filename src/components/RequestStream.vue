<template>
  <v-ons-page id="requestStreamPage">
    <!-- <my-elaborate-popup-content v-show="false" ref="foo"></my-elaborate-popup-content> -->
    <!-- <v-ons-list>
        <v-ons-list-item id="optionsPanel_section" expandable :expanded.sync="optionsPanelView">
            <span id="optionsPanel_section_title">requester options</span>
            <div class="expandable-content">
                <div id="options_panel">
                    <v-ons-row>
                        <v-ons-col>
                            <span class="optionsPanelRowTitle">Tags:</span>
                            <span class="badge badge-pill badge-primary optionsPanelRow">Street View</span>
                        </v-ons-col>
                    </v-ons-row>
                    <v-ons-row>
                        <v-ons-col>
                            <span class="optionsPanelRowTitle">Details:</span>
                            <span class="optionsPanelRow">Side view of santa parade</span>
                        </v-ons-col>
                    </v-ons-row>
                </div>
            </div>
        </v-ons-list-item>
    </v-ons-list>-->
    <div id="map-container">
      <!-- <img id="vivid_logo" src="@/logo/Vivid_logo design2020-05.png" /> -->
      <div id="map" class="map"></div>
      <section id="nav_buttons">
        <div class="flex">
          <v-ons-button class="btn btn--locate flex-right" @click="geolocateMe()">
            <v-ons-icon class="btn__icon" icon="fa-location-arrow"></v-ons-icon>
          </v-ons-button>
        </div>
        <div id="pushToViewStreamPageButton">
          <v-ons-button class="btn btn--join" @click="showJoinDialog()">
            Join
            <v-ons-icon class="btn__icon" icon="fa-users"></v-ons-icon>
          </v-ons-button>
          <v-ons-button class="btn btn--request" @click="showRequestDialog()">
            Request
            <v-ons-icon class="btn__icon" icon="fa-flag"></v-ons-icon>
          </v-ons-button>
          <v-ons-button class="btn btn--golive" @click="showGoliveDialog()">
            Go Live
            <v-ons-icon class="btn__icon" icon="fa-video"></v-ons-icon>
          </v-ons-button>
        </div>
      </section>
    </div>
    <div></div>
    <join-dialog @push-viewstream="fromJoin_list" v-model="isJoinDialog" :markers="joinMarkers"></join-dialog>
    <go-live-dialog
      @push-supplystream="fromSupply_golive"
      v-model="isGoLiveDialog"
      :on-close="geoSearchEvent_golive"
    ></go-live-dialog>
    <request-dialog v-model="isRequestDialog" :on-close="geoSearchEvent"></request-dialog>
  </v-ons-page>
</template>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../../node_modules/leaflet/dist/leaflet.css";
@import "../css/player.css";
@import "../../node_modules/leaflet-geosearch/assets/css/leaflet.css";
@import "../css/requestStream.css";
/* @import "../css/leafletmarkers/leaflet.extra-markers.min.css"; */
.dialog {
  top: 46%;
  height: 82%;
  width: 90%;
  border-radius: 1rem;
}
.dialog-container {
  height: 100%;
}
</style>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";

import env from "@/js/env.js";

import code_transforms from "@/js/location_code_string_prep.js";

let io;

if (socketIOClient.sails) {
  io = socketIOClient;
} else {
  io = sailsIOClient(socketIOClient);
  //io.sails.url = 'http://localhost:1336'
  io.sails.url = env.web_service_url;
}

import OpenLocationCodeJS from "open-location-code";
let OpenLocationCode = OpenLocationCodeJS.OpenLocationCode;

var openLocationCode = new OpenLocationCode();

// import { GeoSearchControl, EsriProvider } from "leaflet-geosearch";

// const myProvider = new EsriProvider();

import { mapMutations, mapActions, mapGetters } from "vuex";
import RequestDialog from "@/components/dialogs/RequestDialog.vue";
import GoLiveDialog from "@/components/dialogs/GoLiveDialog.vue";
import JoinDialog from "@/components/dialogs/JoinDialog.vue";

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
      layers: [],
      options: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      },
      myLocation: null,
      myLocationCircle: null,
      geoSearchLocation: null,
      geoSearchLocationCircle: null,
      defaultRadius: 92,
      optionsPanelView: true,
      streamerIcon: null,
      redMarker: null,
      buttonGo: null,
      slimPinIcon: null,
      joinMarkers: [],
      markerNew: null,
      markerUsers: null,
      markerProfile: null,
      templateJoin: null,
      templateGoLive: null,
      current_request_list: null,
      request_raw_data: null,
      isRequestDialog: false,
      isGoLiveDialog: false,
      isJoinDialog: false,
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
        openLocationCode: null
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
    }
  },
  methods: {
    ...mapMutations({
      _setInBuiltRequestDemo: "setInBuiltRequestDemo",
      _setLocalCopyOfRequestPins: "setLocalCopyOfRequestPins",
      _setSelectedPin: "setSelectedPin",
      _setStreamerWalletAddress: "setStreamerWalletAddress"
    }),
    ...mapActions({
      _find_all_requests: "find_all_requests",
      _add: "add",
      _get_requests: "get_requests",
      _create: "create",
      _updateRequestModel: "update"
    }),
    ...mapGetters({
      _myWalletAddress: "myWalletAddress",
      _getLocalCopyOfRequestPins: "getLocalCopyOfRequestPins",
      _getSelectedPin: "getSelectedPin",
      _getStreamerWalletAddress: "getStreamerWalletAddress"
    }),
    addMarkersLoop(markers) {
      //Loop through the markers array
      for (var i = 0; i < markers.length; i++) {
        // var lon = markers[i][0];
        // var lat = markers[i][1];
        //var popupText = markers[i][2];
        var lon = markers[i].location.feature.geometry.y;
        var lat = markers[i].location.feature.geometry.x;
        const marker = markers[i];

        L.marker([lon, lat], {
          icon: marker.streamer.live ? this.markerUsers : this.markerNew
        })
          .addTo(this.map)
          .bindPopup(
            marker.streamer.live
              ? this.templateJoin(marker)
              : this.templateGoLive(marker),
            {
              maxWidth: 1060
            }
          )
          .on("popupopen", () => {
            marker.streamer.live
              ? document
                  .getElementById("button-join")
                  .addEventListener("click", () => {
                    this.fromJoin();
                  })
              : document
                  .getElementById("button-golive")
                  .addEventListener("click", () => {
                    this.fromSupply();
                  });
          })
          .on("click", e => {
            var locationcode = openLocationCode.encode(
              e.latlng.lng,
              e.latlng.lat,
              11
            );

            locationcode = code_transforms.replace_plus_symbol(locationcode);

            let obj = this._getLocalCopyOfRequestPins().find(
              obj => obj.openLocationCode === locationcode
            );

            this._setSelectedPin(obj);
          });
      }
    },
    fromJoin_list(_str) {
      let obj = this._getLocalCopyOfRequestPins().find(
        obj => obj.openLocationCode === _str
      );

      this._setSelectedPin(obj);
      this._setStreamerWalletAddress(obj.streamer.walletAddress);

      this._setInBuiltRequestDemo(false);
      this.pushToViewStreamPage();
    },
    fromJoin() {
      const selectedPin = this._getSelectedPin();
      if (selectedPin) {
        this._setStreamerWalletAddress(selectedPin.streamer.walletAddress);

        this._setInBuiltRequestDemo(false);
        this.pushToViewStreamPage();
      }
    },
    fromSupply_golive() {
      let selectedPin = this._getSelectedPin();

      selectedPin.streamer.walletAddress = this._myWalletAddress();

      this._setSelectedPin(selectedPin);

      this._setInBuiltRequestDemo(false);
      this.pushToSupplyStreamPage();
    },
    fromSupply() {
      let selectedPin = this._getSelectedPin();

      selectedPin.streamer.walletAddress = this._myWalletAddress();

      this._setSelectedPin(selectedPin);

      //this._updateRequestModel(selectedPin);
      io.socket.post("/request/sockets/update/address", {
        streamName: selectedPin.openLocationCode,
        address: selectedPin.streamer.walletAddress
      });

      this._setInBuiltRequestDemo(false);
      this.pushToSupplyStreamPage();
    },
    fromRequest() {
      const selectedPin = this._getSelectedPin();
      if (selectedPin) {
        this._setStreamerWalletAddress(selectedPin.streamer.walletAddress);

        this._setInBuiltRequestDemo(false);
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
      // Encode a location, default accuracy: var code = openLocationCode.encode(47.365590, 8.524997); console.log(code);
      // Encode a location using one stage of additional refinement:
      //#encode(latitude, longitude, code_length = PAIR_CODE_LENGTH) ⇒ String
      // var code = openLocationCode.encode(
      //   _data.location.x,
      //   _data.location.y,
      //   11
      // );
      this.requestModel.mapPin = _data.mapPin;

      this.requestModel.mapPin.twitterHashTags = _data.mapPin.twitterHashTags;

      this.requestModel.location = _data.location.raw;
      this.requestModel.openLocationCode = _data.openLocationCode;
      this.request_raw_data = _data.location.raw;

      this.requestModel.user.walletAddress = _data.user.walletAddress;
      this.requestModel.streamer.walletAddress = _data.user.walletAddress;

      this._create(JSON.parse(JSON.stringify(this.requestModel)));

      this.addMarkersLoop([this.requestModel]);

      this.map.setView([_data.location.y, _data.location.x], 15);
    },
    geoSearchEvent(_data) {
      // Encode a location, default accuracy: var code = openLocationCode.encode(47.365590, 8.524997); console.log(code);
      // Encode a location using one stage of additional refinement:
      //#encode(latitude, longitude, code_length = PAIR_CODE_LENGTH) ⇒ String
      var code = openLocationCode.encode(
        _data.location.x,
        _data.location.y,
        11
      );
      this.requestModel.mapPin = _data.mapPin;

      this.requestModel.location = _data.location.raw;
      this.requestModel.openLocationCode = code_transforms.replace_plus_symbol(
        code
      );
      this.request_raw_data = _data.location.raw;

      this._create(JSON.parse(JSON.stringify(this.requestModel)));

      this.addMarkersLoop([this.requestModel]);

      this.map.setView([_data.location.y, _data.location.x], 15);
    },
    geolocateMe() {
      this.map.locate();
    },
    onLocationFound(e) {
      var radius = e.accuracy;

      var myProfileIcon = L.icon({
        iconUrl: require("@/assets/markers/marker-profile.svg"),
        iconSize: [38, 95],
        iconAnchor: [28, 40],
        popupAnchor: [-1, -36],
        className: "profilePic"
      });

      this.myLocation = L.marker(e.latlng, {
        icon: myProfileIcon
      })
        .addTo(this.map)
        .bindPopup("You are here")
        .openPopup();

      this.myLocationCircle = L.circle(e.latlng, radius).addTo(this.map);
    },
    onLocationError(e) {
      this.$ons.notification.alert(e.message);

      this.map.setView([51.520748, -0.08504], 15);
    },
    updateVisible(value) {
      console.log(value);
    },
    initMap() {
      this.map = L.map("map").setView([51.520748, -0.08504], 15);

      // new GeoSearchControl({
      //   provider: myProvider, // required
      //   showMarker: true, // optional: true|false  - default true
      //   showPopup: false, // optional: true|false  - default false
      //   marker: {
      //     // optional: L.Marker    - default L.Icon.Default
      //     icon: new L.Icon.Default(),
      //     draggable: false
      //   },
      //   // popupFormat: ({
      //   //     query,
      //   //     result
      //   // }) => result.label, // optional: function    - default returns result label
      //   maxMarkers: 1, // optional: number      - default 1
      //   retainZoomLevel: false, // optional: true|false  - default false
      //   animateZoom: true, // optional: true|false  - default true
      //   autoClose: true, // optional: true|false  - default false
      //   searchLabel: "Enter address", // optional: string      - default 'Enter address'
      //   keepResult: false
      // }).addTo(this.map);

      // this.map.on("geosearch/showlocation", this.geoSearchEvent);

      //  document.getElementById("optionsPanel_section").showExpansion();
    },
    initLayers() {
      this.tileLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWEwNnJpaSIsImEiOiJjazZkeTU2NnAxbWF4M2xxajN6NWIyb2l6In0.4iTjEpS8cIa_Um3zhE9keQ",
        {
          //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          attribution: false,
          maxZoom: 36,
          id: "mapbox/streets-v11"
        }
      ).addTo(this.map);
    }
  },
  beforeCreate() {
    console.log("registerWeb3 Action dispatched");
    this.$store.dispatch("registerWeb3");
  },
  async mounted() {
    // io.socket.on("requests", msg => {
    //   if (msg.data.user.walletAddress !== this._myWalletAddress()) {
    //     if (msg.data && msg.data.length) {
    //       this.addMarkersLoop([msg.data]);
    //     }
    //   }
    // });

    // io.socket.get("/requests", resData => {
    //   if (resData && resData.length) {
    //     this.joinMarkers = resData.filter(markers => markers.streamer.live);
    //     this.addMarkersLoop(resData);
    //   }
    // });

    io.socket.on("requests", msg => {
      //if (msg.data.user.walletAddress !== this._myWalletAddress()) {
      //if (msg.data && msg.data.length) {
      if (msg.data) {
        this.addMarkersLoop([msg.data]);

        var localCopyOfRequestPins = this._getLocalCopyOfRequestPins();

        //If the local pins are present then loop through them and update the relevant record.
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
          //If the local pins are not present then set the first pin
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
      //}
    });

    io.socket.get("/requests", resData => {
      if (resData && resData.length) {
        this.joinMarkers = resData.filter(markers => markers.streamer.live);
        this.addMarkersLoop(resData);
        this._setLocalCopyOfRequestPins(resData);
      }
    });

    io.socket.on("livestreamended", resData => {
      if (resData.data) {
        let arrrayOfLayerIDsToRemove = [];

        //Loop through the map layers to remove map pins corresponding to the live stream which has ended.
        for (const property in this.map._layers) {
          if (this.map._layers[property]._latlng) {
            if (
              resData.data.location.feature.geometry.x ==
                this.map._layers[property]._latlng.lng &&
              resData.data.location.feature.geometry.y ==
                this.map._layers[property]._latlng.lat
            ) {
              //Create an array of map layer ids to delete
              arrrayOfLayerIDsToRemove.push(property);
            }
          }
        }

        //Loop through map layer ids and delete from map
        arrrayOfLayerIDsToRemove.forEach(id => {
          this.map._layers[id].remove();
        });

        //Remove map pin from join marker popup list
        this.joinMarkers = this.joinMarkers.filter(
          markers => markers.openLocationCode != resData.data.openLocationCode
        );

        //Remove marker from local copy of map pin data
        let localCopyOfRequestPins = this._getLocalCopyOfRequestPins();
        localCopyOfRequestPins = localCopyOfRequestPins.filter(
          markers => markers.openLocationCode != resData.data.openLocationCode
        );
        this._setLocalCopyOfRequestPins(localCopyOfRequestPins);
      }
    });

    this.templateJoin = requestModel => `
      <div>
      <h3>${requestModel.mapPin.details}</h3>
      <p>${requestModel.mapPin.twitterHashTags
        .reduce((acc, tag) => {
          acc += ` #${tag},`;
          return acc;
        }, "")
        .slice(1, -1)}</p>
      <v-ons-button id="button-join" type="button">Join</v-ons-button>
      </div>
      `;

    this.templateGoLive = requestModel => `
    <div>
      <h3>${requestModel.mapPin.details}</h3>
      <p>${requestModel.mapPin.twitterHashTags
        .reduce((acc, tag) => {
          acc += ` #${tag},`;
          return acc;
        }, "")
        .slice(1, -1)}</p>
      <v-ons-button id="button-golive" type="button">Go Live</v-ons-button>
    </div>
    `;

    this.initMap();

    this.initLayers();

    this.slimPinIcon = L.icon({
      //iconUrl: "slim_pin.svg",
      iconUrl: require("@/assets/markers/slim_pin.svg"),
      iconSize: [28, 85], // size of the icon
      // iconSize: [38, 95],
      iconAnchor: [13, 63],
      className: "slimPinIcon",
      popupAnchor: [0, -60]
      // shadowSize: [68, 95],
      // shadowAnchor: [22, 94]
    });

    this.markerUsers = L.icon({
      iconUrl: require("@/assets/markers/marker-users.svg"),
      iconSize: [55, 80], // size of the icon
      iconAnchor: [13, 63],
      className: "markerUsers",
      popupAnchor: [0, -60]
    });
    this.markerNew = L.icon({
      iconUrl: require("@/assets/markers/marker-new.svg"),
      iconSize: [55, 80], // size of the icon
      iconAnchor: [13, 63],
      className: "markerNew",
      popupAnchor: [0, -60]
    });
    this.markerProfile = L.icon({
      iconUrl: require("@/assets/markers/marker-profile.svg"),
      iconSize: [55, 80], // size of the icon
      iconAnchor: [13, 63],
      className: "markerNew",
      popupAnchor: [0, -60]
    });

    var london = new L.LatLng(51.5056, -0.1213);

    this.map.setView(london, 13);

    // Define an array. This could be done in a seprate js file.
    // This tidy formatted section could even be generated by a server-side script
    // or fetched seperately as a jsonp request.
    // var markers = [
    //   [-0.1244324, 51.5006728, "Big Ben", "new"],
    //   [-0.119623, 51.503308, "London Eye", "join"],
    //   [
    //     -0.1279688,
    //     51.5077286,
    //     "Nelson's Column<br><a href=\"https://en.wikipedia.org/wiki/Nelson's_Column\">wp</a>",
    //     "new"
    //   ]
    // ];

    // //Loop through the markers array
    // for (var i = 0; i < markers.length; i++) {
    //   var lon = markers[i][0];
    //   var lat = markers[i][1];
    //   //var popupText = markers[i][2];
    //   var iconType = markers[i][3];

    //   var markerLocation = new L.LatLng(lat, lon);
    //   var marker = new L.Marker(markerLocation, {
    //     icon: iconType == "new" ? this.markerNew : this.markerUsers
    //   });
    //   this.map.addLayer(marker);
    //   marker
    //     //.bindPopup(popupText)
    //     .bindPopup(this.templateGoLive, {
    //       maxWidth: 1060
    //     })
    //     .on("popupopen", () => {
    //       document
    //         .getElementById("button-golive")
    //         .addEventListener("click", () => {
    //           this.fromSupply();
    //         });
    //     });
    // }

    this.map.on("locationfound", this.onLocationFound);

    this.map.on("locationerror", this.onLocationError);
    // const results = await myProvider.search({ query: "walthamstow" });
    // console.log(results)
    // this.geoSearchEvent(results)
  }
};
</script>
