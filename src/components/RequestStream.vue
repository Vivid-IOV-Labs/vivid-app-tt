<template>
<v-ons-page id="requestStreamPage">
    <!-- <my-elaborate-popup-content v-show="false" ref="foo"></my-elaborate-popup-content> -->
    <v-ons-list>
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
    </v-ons-list>
    <!-- <img id="vivid_logo" src="@/logo/Vivid_logo design2020-05.png" /> -->

    <div id="map" class="map"></div>

    <section id="nav_buttons">
        <div id="pushToViewStreamPageButton">
            <v-ons-button @click="fromRequest()">Send Video Request</v-ons-button>
        </div>
    </section>
</v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../../node_modules/leaflet/dist/leaflet.css";
@import "../css/player.css";
@import "../../node_modules/leaflet-geosearch/assets/css/leaflet.css";
@import "../css/requestStream.css";
/* @import "../css/leafletmarkers/leaflet.extra-markers.min.css"; */
</style>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

import env from "@/js/env.js"


let io;

if (socketIOClient.sails) {
    io = socketIOClient;

} else {
    io = sailsIOClient(socketIOClient);
    //io.sails.url = 'http://localhost:1336'
    io.sails.url = env.web_service_url

}

import OpenLocationCodeJS from 'open-location-code';
let OpenLocationCode = OpenLocationCodeJS.OpenLocationCode

var openLocationCode = new OpenLocationCode();

import {
    GeoSearchControl,
    EsriProvider
} from "leaflet-geosearch";

const myProvider = new EsriProvider();

import {
    mapMutations,
    mapActions,
    mapGetters
} from 'vuex';

export default {
    name: "requestStream",
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
            templateForm: null,
            templateSupplyStreamButton: null,
            current_request_list: null,
            request_raw_data: null,
            requestModel: {
                request: {
                    details: 'Side view of santa parade',
                    tags: [
                        'Street View'
                    ],
                    twitterHashTags: [
                        '#example1',
                        '#example2'
                    ]
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
    methods: {
        ...mapMutations({
            _setInBuiltRequestDemo: 'setInBuiltRequestDemo',
            _setLocalCopyOfRequestPins: 'setLocalCopyOfRequestPins',
            _setSelectedPin: 'setSelectedPin',
            _setStreamerWalletAddress: 'setStreamerWalletAddress'

        }),
        ...mapActions({
            _find_all_requests: 'find_all_requests',
            _add: 'add',
            _get_requests: 'get_requests',
            _create: 'create',
            _updateRequestModel: 'update',
        }),
        ...mapGetters({
            _myWalletAddress: 'myWalletAddress',
            _getLocalCopyOfRequestPins: 'getLocalCopyOfRequestPins',
            _getSelectedPin: 'getSelectedPin',
            _getStreamerWalletAddress: 'getStreamerWalletAddress'

        }),
        addMarkersLoop(markers) {
            //Loop through the markers array
            for (var i = 0; i < markers.length; i++) {

                // var lon = markers[i][0];
                // var lat = markers[i][1];
                //var popupText = markers[i][2];
                var lon = markers[i].location.feature.geometry.y;
                var lat = markers[i].location.feature.geometry.x;

                L.marker([lon, lat], {
                        icon: this.slimPinIcon
                    })
                    .addTo(this.map)
                    .bindPopup(this.templateSupplyStreamButton, {
                        maxWidth: 1060
                    })
                    .on('popupopen', () => {
                        document.getElementById('button-submit').addEventListener("click", () => {
                            this.fromSupply()

                        });
                    }).on('click', (e) => {

                        var locationcode = openLocationCode.encode(e.latlng.lng, e.latlng.lat, 11);

                        let obj = this._getLocalCopyOfRequestPins().find(obj => obj.openLocationCode === locationcode);

                        this._setSelectedPin(obj)

                    });

            }

        },
        fromJoin() {
            this._setInBuiltRequestDemo(true);
            this.pushToViewStreamPage()

        },
        fromSupply() {
            let selectedPin = this._getSelectedPin()

            selectedPin = Object.assign({}, selectedPin, {
                streamer: {
                    live: true,
                    walletAddress: this._myWalletAddress()
                }
            })

            this._setSelectedPin(selectedPin)

            this._updateRequestModel(selectedPin)

            this._setInBuiltRequestDemo(false);
            this.pushToSupplyStreamPage()

        },
        fromRequest() {
            const selectedPin = this._getSelectedPin()
            if(selectedPin){
                this._setStreamerWalletAddress(selectedPin.streamer.walletAddress)

                this._setInBuiltRequestDemo(false);
                this.pushToViewStreamPage()
            }

            

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
            var code = openLocationCode.encode(_data.location.x, _data.location.y, 11);

            this.requestModel.location = _data.location.raw;
            this.requestModel.openLocationCode = code;
            this.request_raw_data = _data.location.raw;

            this._create(JSON.parse(JSON.stringify(this.requestModel)))

            this.addMarkersLoop([this.requestModel])

            this.map.setView([_data.location.y, _data.location.x], 15);

        },
        onLocationFound(e) {
            var radius = e.accuracy;

            var myProfileIcon = L.icon({
                iconUrl: require('@/assets/markers/profile_pic.png'),
                iconSize: [38, 95],
                iconAnchor: [28, 40],
                popupAnchor: [-1, -36],
                className: 'profilePic'

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
        initMap() {
            this.map = L.map("map").setView([51.520748, -0.08504], 15);

            new GeoSearchControl({
                provider: myProvider, // required
                showMarker: true, // optional: true|false  - default true
                showPopup: false, // optional: true|false  - default false
                marker: {
                    // optional: L.Marker    - default L.Icon.Default
                    icon: new L.Icon.Default(),
                    draggable: false
                },
                // popupFormat: ({
                //     query,
                //     result
                // }) => result.label, // optional: function    - default returns result label
                maxMarkers: 1, // optional: number      - default 1
                retainZoomLevel: false, // optional: true|false  - default false
                animateZoom: true, // optional: true|false  - default true
                autoClose: true, // optional: true|false  - default false
                searchLabel: "Enter address", // optional: string      - default 'Enter address'
                keepResult: false

            }).addTo(this.map);

            this.map.on("geosearch/showlocation", this.geoSearchEvent);

            document.getElementById("optionsPanel_section").showExpansion();

        }

        ,
        initLayers() {
            this.tileLayer = L.tileLayer(
                "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWEwNnJpaSIsImEiOiJjazZkeTU2NnAxbWF4M2xxajN6NWIyb2l6In0.4iTjEpS8cIa_Um3zhE9keQ", {
                    //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    attribution: false,
                    maxZoom: 36,
                    id: "mapbox/streets-v11"

                }
            ).addTo(this.map);

        },

    },
    mounted() {

        io.socket.on('requests', (msg) => {

            console.log(msg)

            //if (msg.data.user.walletAddress !== this._myWalletAddress()) {
            //if (msg.data && msg.data.length) {
            if (msg.data) {
                this.addMarkersLoop([msg.data])

                var localCopyOfRequestPins = this._getLocalCopyOfRequestPins()
                localCopyOfRequestPins.forEach((element, index) => {
                    if (element.id === msg.id) {
                        localCopyOfRequestPins[index] = Object.assign({}, localCopyOfRequestPins[index], msg.data)
                        this._setLocalCopyOfRequestPins(localCopyOfRequestPins)

                    }
                });

            }
            //}
        })

        io.socket.get('/requests', (resData) => {
            if (resData && resData.length) {
                this.addMarkersLoop(resData)
                this._setLocalCopyOfRequestPins(resData)

            }
        });

        this.templateForm = `<v-ons-button id="button-submit" type="button">Join</v-ons-button>`

        this.templateSupplyStreamButton = `<v-ons-button id="button-submit" type="button">Supply</v-ons-button>`

        this.slimPinIcon = L.icon({
            //iconUrl: "slim_pin.svg",
            iconUrl: require('@/assets/markers/slim_pin.svg'),
            iconSize: [28, 85], // size of the icon
            // iconSize: [38, 95],
            iconAnchor: [13, 63],
            className: 'slimPinIcon',
            popupAnchor: [0, -60],
            // shadowSize: [68, 95],
            // shadowAnchor: [22, 94]

        });

        this.initMap();

        this.initLayers();

        var london = new L.LatLng(51.5056, -0.1213);

        this.map.setView(london, 13);

        // Define an array. This could be done in a seprate js file.
        // This tidy formatted section could even be generated by a server-side script
        // or fetched seperately as a jsonp request.
        var markers = [
            [-0.1244324, 51.5006728, "Big Ben"],
            [-0.119623, 51.503308, "London Eye"],
            [-0.1279688, 51.5077286, "Nelson's Column<br><a href=\"https://en.wikipedia.org/wiki/Nelson's_Column\">wp</a>"]

        ];

        //Loop through the markers array
        for (var i = 0; i < markers.length; i++) {

            var lon = markers[i][0];
            var lat = markers[i][1];
            //var popupText = markers[i][2];

            // var markerLocation = new L.LatLng(lat, lon);
            // var marker = new L.Marker(markerLocation, {
            //     icon: this.slimPinIcon
            // });
            // this.map.addLayer(marker);

            // marker
            //     //.bindPopup(popupText)
            //     .bindPopup(this.templateSupplyStreamButton, {
            //         maxWidth: 1060
            //     })
            //     .on('popupopen', () => {
            //         document.getElementById('button-submit').addEventListener("click", () => {
            //             this.fromSupply()

            //         });
            //     })

            L.marker([lon, lat], {
                    icon: this.slimPinIcon
                })
                .addTo(this.map)
                .bindPopup(this.templateSupplyStreamButton, {
                    maxWidth: 1060
                })
                .on('popupopen', () => {
                    console.log(arguments)
                    document.getElementById('button-submit').addEventListener("click", () => {
                        this.fromSupply()

                    });
                })
        }

        this.map.on("locationfound", this.onLocationFound);

        this.map.on("locationerror", this.onLocationError);

    },
    beforeCreate() {
        console.log('registerWeb3 Action dispatched')
        this.$store.dispatch('registerWeb3')
        //this.$store.dispatch('getContractInstance')
    },

};
</script>
