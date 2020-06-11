<template>
<v-ons-page id="requestStreamPage">
    <!-- <my-elaborate-popup-content v-show="false" ref="foo"></my-elaborate-popup-content> -->

    <v-ons-list>
        <v-ons-list-item id="optionsPanel_section" expandable :expanded.sync="optionsPanelView">
            <span id="optionsPanel_section_title">request options</span>
            <div class="expandable-content">
                <div id="options_panel">
                    <v-ons-row>
                        <v-ons-col>
                            <span class="optionsPanelRowTitle">Tags:</span>
                            <!-- <span class="label-info">Street View</span> -->
                            <span class="badge badge-pill badge-primary optionsPanelRow">Street View</span>
                        </v-ons-col>
                    </v-ons-row>
                    <v-ons-row>
                        <v-ons-col>
                            <span class="optionsPanelRowTitle">Details:</span>
                            <span class="optionsPanelRow">Side view of santa parade</span>
                        </v-ons-col>
                    </v-ons-row>
                    <!-- <v-ons-row>
                        <v-ons-col>
                            <span class="optionsPanelRowTitle">Tip Offered:</span>
                            <span class="optionsPanelRow">NEAR 0.05/min</span>
                        </v-ons-col>
                    </v-ons-row> -->
                    <!-- <v-ons-row>
                        <v-ons-col>
                            <span class="optionsPanelRowTitle">Range:</span>
                            <v-ons-range size="0.813em"></v-ons-range>
                        </v-ons-col>
                    </v-ons-row> -->
                </div>
            </div>
        </v-ons-list-item>
    </v-ons-list>
    <img id="vivid_logo" src="@/logo/Vivid_logo design2020-05.png" />
    <!-- <div id="map-container"> -->
    <div id="map" class="map"></div>
    <!-- </div> -->
    <section id="nav_buttons">
        <v-ons-list>
            <!-- <v-ons-list-item>
          <v-ons-row>
            <v-ons-col>
              <v-ons-range style="width: 100%;"></v-ons-range>
            </v-ons-col>
          </v-ons-row>
        </v-ons-list-item>-->
        </v-ons-list>
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
//import $ from 'jquery'

// import "@/js/leaflet.extra-markers.js";

// import myElaboratePopupContent from "@/components/myElaboratePopupContent.vue";

import {
    GeoSearchControl,
    EsriProvider
} from "leaflet-geosearch";
const myProvider = new EsriProvider();

import {
    mapMutations,
    mapActions
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
            request_raw_data:null
        };
    },
    methods: {
        ...mapMutations({
            _setInBuiltRequestDemo: 'setInBuiltRequestDemo'

        }),
        ...mapActions({
            _find_all_requests: 'find_all_requests',
            _add : 'add',
            _get_requests:'get_requests'
        }),
        layerClickHandler(e) {

            var marker = e.target

            //if (marker.hasOwnProperty('_popup')) {
            if (Object.prototype.hasOwnProperty.call(marker, '_popup')) {
                marker.unbindPopup();
            }

            marker.bindPopup(this.templateForm);
            marker.openPopup();

            var buttonSubmit = L.DomUtil.get('button-submit');

            console.log(buttonSubmit)

            L.DomEvent.addListener(buttonSubmit, 'click', function () {
                //marker.closePopup();
                console.log('button clicked to submit')
            });

        },
        fromJoin() {
            this._setInBuiltRequestDemo(true);
            this.pushToViewStreamPage()

        },
        fromSupply() {
            this._setInBuiltRequestDemo(false);
            this.pushToSupplyStreamPage()

        },
        fromRequest() {

            // const request_model = {
            //     location: JSON.parse(JSON.stringify(this.request_raw_data)),
            //     options:{
            //         eth_address:'0xxxess',
            //         details: 'Side view of santa parade',
            //         tags: ['Street View']
            //     }
            // }

            // this._add(request_model).then((response) =>{
            //     console.log(response.data)

            //     this.add_multiply_markers(response.data)
       

            // })

            this._setInBuiltRequestDemo(false);
            this.pushToViewStreamPage()

        },
        pushToViewStreamPage() {
            this.$emit("push-page");
        },
        pushToSupplyStreamPage() {
            console.log(arguments)
            this.$emit("push-supply");
        },
        addIDEALondonMarker() {

            L.marker([41.6332836, -72.7738706], {
                    icon: this.slimPinIcon
                })
                .addTo(this.map)
                //.bindPopup("IEDALondon, London EC2A 2BB");
                .bindPopup(this.templateForm, {
                    maxWidth: 1060
                })
                .on('popupopen', () => {
                    document.getElementById('button-submit').addEventListener("click", () => {
                        this.fromJoin()

                    });
                })
                .on('popupclose', () => {
                    //console.log('popup closed')
                })
                .openPopup();

            this.map.setView([41.6332836, -72.7738706], 15);

        },
        geoSearchEvent(_data) {

            console.log(_data)
            this.request_raw_data = _data.location.raw;

            if (this.myLocation) this.map.removeLayer(this.myLocation);
            if (this.myLocationCircle) this.map.removeLayer(this.myLocationCircle);

            if (this.geoSearchLocation) this.map.removeLayer(this.geoSearchLocation);
            if (this.geoSearchLocationCircle)
                this.map.removeLayer(this.geoSearchLocationCircle);

            //Readd current streamer
            this.addIDEALondonMarker();

            this.geoSearchLocation = L.marker([_data.location.y, _data.location.x], {
                    icon: this.slimPinIcon
                })
                .addTo(this.map)
                .bindPopup(_data.location.label)
                .openPopup();

            // this.geoSearchLocationCircle = L.circle(
            //     [_data.location.y, _data.location.x],
            //     this.defaultRadius
            // ).addTo(this.map);

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
        },
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
        locationSuccess(pos) {
            var crd = pos.coords;

            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
        },

        locationError(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        },
        add_multiply_markers(markers){
            //Loop through the markers array
            for (var i = 0; i < markers.length; i++) {

                // var lon = markers[i][0];
                // var lat = markers[i][1];
                // var popupText = markers[i][2];

                var lat = markers[i].location.feature.geometry.y;
                var lon = markers[i].location.feature.geometry.x;
                var popupText = markers[i].location.feature.name;

                console.log([lat, lon])

                var markerLocation = new L.LatLng(lat, lon);
                var marker = new L.Marker(markerLocation, {
                    icon: this.slimPinIcon
                });

                
                this.map.addLayer(marker);

                marker.bindPopup(popupText);

            }

        }
    },
    mounted() {

        this.templateForm = `<v-ons-button id="button-submit" type="button">Join</v-ons-button>`

        this.templateSupplyStreamButton = `<v-ons-button id="button-submit" type="button">Supply</v-ons-button>`

        this.initMap();
        this.initLayers();

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

        // this._find_all_requests().then((response) => {
        //     this.current_request_list = response.data

        //     var london = new L.LatLng(51.5056, -0.1213);
        //     this.map.setView(london, 13);

        //     // Define an array. This could be done in a seperate js file.
        //     // This tidy formatted section could even be generated by a server-side script
        //     // or fetched seperately as a jsonp request.
        //     var markers = [
        //         [-0.1244324, 51.5006728, "Big Ben"],
        //         [-0.119623, 51.503308, "London Eye"],
        //         [-0.1279688, 51.5077286, "Nelson's Column<br><a href=\"https://en.wikipedia.org/wiki/Nelson's_Column\">wp</a>"]
        //     ];

        //     //Loop through the markers array
        //     for (var i = 0; i < markers.length; i++) {

        //         var lon = markers[i][0];
        //         var lat = markers[i][1];
        //         var popupText = markers[i][2];

        //         var markerLocation = new L.LatLng(lat, lon);
        //         var marker = new L.Marker(markerLocation, {
        //             icon: this.slimPinIcon
        //         });
        //         this.map.addLayer(marker);

        //         marker.bindPopup(popupText);

        //     }

        // })

        // this._get_requests().then((response) => {
        //     //this.current_request_list = response.data
        //     console.log(response.data)

        //     var london = new L.LatLng(51.5056, -0.1213);
        //     this.map.setView(london, 13);

        //     // Define an array. This could be done in a seperate js file.
        //     // This tidy formatted section could even be generated by a server-side script
        //     // or fetched seperately as a jsonp request.
        //     var markers = [
        //         [-0.1244324, 51.5006728, "Big Ben"],
        //         [-0.119623, 51.503308, "London Eye"],
        //         [-0.1279688, 51.5077286, "Nelson's Column<br><a href=\"https://en.wikipedia.org/wiki/Nelson's_Column\">wp</a>"]
        //     ];

        //     //Loop through the markers array
        //     for (var i = 0; i < markers.length; i++) {

        //         var lon = markers[i][0];
        //         var lat = markers[i][1];
        //         //var popupText = markers[i][2];

        //         var markerLocation = new L.LatLng(lat, lon);
        //         var marker = new L.Marker(markerLocation, {
        //             icon: this.slimPinIcon
        //         });
        //         this.map.addLayer(marker);

        //         marker
        //         //.bindPopup(popupText)
        //         .bindPopup(this.templateSupplyStreamButton, {
        //             maxWidth: 1060
        //         })
        //         .on('popupopen', () => {
        //             document.getElementById('button-submit').addEventListener("click", () => {
        //                 this.fromSupply()

        //             });
        //         })

        //     }

        // })

         var london = new L.LatLng(51.5056, -0.1213);
            this.map.setView(london, 13);

            // Define an array. This could be done in a seperate js file.
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

                var markerLocation = new L.LatLng(lat, lon);
                var marker = new L.Marker(markerLocation, {
                    icon: this.slimPinIcon
                });
                this.map.addLayer(marker);

                marker
                //.bindPopup(popupText)
                .bindPopup(this.templateSupplyStreamButton, {
                    maxWidth: 1060
                })
                .on('popupopen', () => {
                    document.getElementById('button-submit').addEventListener("click", () => {
                        this.fromSupply()

                    });
                })

            }

        this.map.on("locationfound", this.onLocationFound);

        this.map.on("locationerror", this.onLocationError);

    }
};
</script>
