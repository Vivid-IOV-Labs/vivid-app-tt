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
    </v-ons-list> -->
    <div id="map-container">
      <!-- <img id="vivid_logo" src="@/logo/Vivid_logo design2020-05.png" /> -->
      <div id="map" class="map"></div>
      <section id="nav_buttons">
        <div class="flex">
          <v-ons-button class="btn--locate flex-right" @click="geolocateMe()"
            ><v-ons-icon
              class="btn__icon--white"
              icon="fa-location-arrow"
            ></v-ons-icon
          ></v-ons-button>
        </div>
        <div id="pushToViewStreamPageButton">
          <v-ons-button class="btn--join" @click="showJoinDialog()"
            >Join
            <v-ons-icon class="btn__icon--white" icon="fa-users"></v-ons-icon
          ></v-ons-button>
          <v-ons-button class="btn--request" @click="showRequestDialog()"
            >Request
            <v-ons-icon class="btn__icon--white" icon="fa-flag"></v-ons-icon
          ></v-ons-button>
          <v-ons-button class="btn--create" @click="showGoliveDialog()"
            >Go Live
            <v-ons-icon class="btn__icon--white" icon="fa-video"></v-ons-icon
          ></v-ons-button>
        </div>
      </section>
    </div>
    <div></div>
    <join-dialog
      @push-viewstream="fromJoin"
      v-model="isJoinDialog"
      :markers="joinMarkers"
    ></join-dialog>
    <go-live-dialog
      @push-supplystream="fromSupply"
      v-model="isGoLiveDialog"
      :on-close="geoSearchEvent"
    ></go-live-dialog>
    <request-dialog
      v-model="isRequestDialog"
      :on-close="geoSearchEvent"
    ></request-dialog>
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
    }
  },
  methods: {
    ...mapMutations({
      _setInBuiltRequestDemo: "setInBuiltRequestDemo"
    }),
    ...mapActions({
      _find_all_requests: "find_all_requests",
      _add: "add",
      _get_requests: "get_requests",
      _create: "create"
    }),
    ...mapGetters({
      _myWalletAddress: "myWalletAddress"
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
          });
      }
    },
    fromJoin() {
      this._setInBuiltRequestDemo(false);
      this.pushToViewStreamPage();
    },
    fromSupply() {
      this._setInBuiltRequestDemo(false);
      this.pushToSupplyStreamPage();
    },
    fromRequest() {
      this._setInBuiltRequestDemo(false);
      this.pushToViewStreamPage();
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
      this.requestModel.openLocationCode = code;
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
  async mounted() {
    io.socket.on("requests", msg => {
      if (msg.data.user.walletAddress !== this._myWalletAddress()) {
        if (msg.data && msg.data.length) {
          this.addMarkersLoop([msg.data]);
        }
      }
    });

    io.socket.get("/requests", resData => {
      if (resData && resData.length) {
        this.joinMarkers = resData.filter(markers => markers.streamer.live);
        this.addMarkersLoop(resData);
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
