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
    mapMutations
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
            purpleStreamerIcon: null,
            templateForm: null
        };
    },
    methods: {
        ...mapMutations({
            _setInBuiltRequestDemo: 'setInBuiltRequestDemo'

        }),
        layerClickHandler(e) {

            var marker = e.target
            //properties = e.target.feature.properties;

            //return this.map.hasOwnProperty(normalizeName(name))
            //return Object.prototype.hasOwnProperty.call(this.map, normalizeName(name));

            //if (marker.hasOwnProperty('_popup')) {
            if (Object.prototype.hasOwnProperty.call(marker, '_popup')) {
                marker.unbindPopup();
            }

            marker.bindPopup(this.templateForm);
            marker.openPopup();

            //   L.DomUtil.get('value-arc').textContent = properties.arc;
            //   L.DomUtil.get('value-speed').textContent = properties.speed;

            //   var inputSpeed = L.DomUtil.get('input-speed');
            //   inputSpeed.value = properties.speed;
            //   L.DomEvent.addListener(inputSpeed, 'change', function (e) {
            //     properties.speed = e.target.value;
            //   });

            var buttonSubmit = L.DomUtil.get('button-submit');

            console.log(buttonSubmit)

            L.DomEvent.addListener(buttonSubmit, 'click', function () {
                //marker.closePopup();
                console.log('button clicked to submit')
            });

        },
        fromJoin(){
            this._setInBuiltRequestDemo(true);
            this.pushToViewStreamPage()

        },
        fromRequest(){
            this._setInBuiltRequestDemo(false);
            this.pushToViewStreamPage()
            
        },
        pushToViewStreamPage() {
            this.$emit("push-page");
        },
        addIDEALondonMarker() {
            //const template = this.$refs.foo.$el.innerHTML;
            //Add Marker for IDEALondon location

            //             // eslint-disable-next-line  
            // delete L.Icon.Default.prototype._getIconUrl  
            // // eslint-disable-next-line  
            // L.Icon.Default.mergeOptions({  
            //   // iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),  
            //   // iconUrl: require('leaflet/dist/images/marker-icon.png'),  
            //   // shadowUrl: require('leaflet/dist/images/marker-shadow.png')  
            //    iconRetinaUrl: require('~@/components/slim_pin.svg'),  
            //   iconUrl: require('~@/components/slim_pin.svg'),  
            //   shadowUrl: require('~@/components/slim_pin.svg')  
            // })

            //           var LeafIcon = L.Icon.extend({
            // 	options: {
            // //		shadowUrl: require('@/assets/markers/slim_pin.svg'), 
            // 		// iconSize:     [38, 95],
            // 		// shadowSize:   [50, 64],
            // 		// iconAnchor:   [22, 94],
            // 		// shadowAnchor: [4, 62],
            // 		// popupAnchor:  [-3, -76]
            // 	}
            // });

            // var greenIcon = new LeafIcon({iconUrl: require('@/assets/markers/slim_pin.svg')});

            L.marker([51.520748, -0.08504], {
                    icon: this.purpleStreamerIcon
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

            L.circle([51.520748, -0.08504], this.defaultRadius).addTo(this.map);

            this.map.setView([51.520748, -0.08504], 15);
        },
        geoSearchEvent(_data) {
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
            this.geoSearchLocationCircle = L.circle(
                [_data.location.y, _data.location.x],
                this.defaultRadius
            ).addTo(this.map);
            this.map.setView([_data.location.y, _data.location.x], 15);
        },
        onLocationFound(e) {
            var radius = e.accuracy;

            //   const icon = L.divIcon({
            //     className: "custom-div-icon",
            //     html:
            //       "<div style='background-color:#4838cc;' class='marker-pin'></div><i class='fa fa-camera awesome'>",
            //     iconSize: [30, 42],
            //     iconAnchor: [15, 42]
            //   });

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

            //   this.map.locate({
            //     setView: true,
            //     maxZoom: 20
            //   });

            //Add Marker for Idea London
            //this.addIDEALondonMarker();

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

            //L.marker([51.5, -0.09], {icon: greenIcon}).bindPopup("I am a green leaf.").addTo(map);

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
        }
    },
    mounted() {

        //         this.templateForm = '<form id="popup-form">\
        //   <label for="input-speed">New speed:</label>\
        //   <input id="input-speed" class="popup-input" type="number" />\
        //   <table class="popup-table">\
        //     <tr class="popup-table-row">\
        //       <th class="popup-table-header">Arc numer:</th>\
        //       <td id="value-arc" class="popup-table-data"></td>\
        //     </tr>\
        //     <tr class="popup-table-row">\
        //       <th class="popup-table-header">Current speed:</th>\
        //       <td id="value-speed" class="popup-table-data"></td>\
        //     </tr>\
        //   </table>\
        //   <button id="button-submit" type="button">Save Changes</button>\
        // </form>';

        // this.templateForm = `<button id="button-submit" type="button">Join Stream</button>`

        this.templateForm = `<v-ons-button id="button-submit" type="button">Join</v-ons-button>`

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

        this.purpleStreamerIcon = L.icon({
            //iconUrl: "slim_pin.svg",
            iconUrl: require('@/assets/markers/purple_user.png'),
            iconSize: [28, 85], // size of the icon
            // iconSize: [38, 95],
            iconAnchor: [30, 52],
            className: 'purpleStreamerIcon',
            popupAnchor: [-3, -46],
            // shadowSize: [68, 95],
            // shadowAnchor: [22, 94]
        });

        this.addIDEALondonMarker();

        this.map.on("locationfound", this.onLocationFound);

        this.map.on("locationerror", this.onLocationError);

        // this.streamerIcon = L.icon({
        //   iconUrl: "../../assets/markers/slim_pin.svg",
        //   iconSize: [38, 95],
        //   iconAnchor: [22, 94],
        //   popupAnchor: [-3, -76],
        //   shadowSize: [68, 95],
        //   shadowAnchor: [22, 94]
        // });
        // this.redMarker = L.ExtraMarkers.icon({
        //   icon: "fa-coffee",
        //   markerColor: "red",
        //   shape: "square",
        //   prefix: "fa"
        // });

        //this.addIDEALondonMarker();

        //navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, this.options);

    }
};
</script>
