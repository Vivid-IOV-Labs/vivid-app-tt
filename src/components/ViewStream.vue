<template>
  <v-ons-page id="viewStreamPage">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button
          @click.prevent="endViewingStream()"
        ></v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">View Stream</span>
      </div>
    </v-ons-toolbar>
    <v-ons-list>
      <v-ons-list-item id="optionsPanel_section_viewStream">
        <div id="pay-info-section">
          <v-ons-button
            v-show="isInBuiltRequestDemo()"
            id="payingLabel"
            class="badge badge-warning"
          >
            Tip
            <strong>
              <!-- <i>{{PayToUserName}}</i> -->
              <i>User</i>
            </strong>
          </v-ons-button>
          <span id="payment-ticker" class="badge badge-pill badge-info">{{
            defaultTipAmount + " TT"
          }}</span>
        </div>
        <div class="expandable-content">
          <div id="options_panel"></div>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <div id="view-video-panel">
      <div v-show="isInBuiltRequestDemo()" class="container">
        <div class="jumbotron">
          <video
            id="inBuiltVideoExample"
            src="../assets/video/santa5.mp4"
            playsinline
          ></video>
        </div>
      </div>
      <div v-show="!isInBuiltRequestDemo()" class="container">
        <div class="jumbotron">
          <div id="video_info">
            Stream will start playing automatically
            <br />when it is live
          </div>
          <video id="remoteVideo" autoplay controls></video>
          <!-- <img id="play_button" src="images/play.png" @click="playVideo" /> -->
          <!-- <input type="text" class="form-control" v-model="streamId" id="streamName" placeholder="Type stream name" /> -->
        </div>
      </div>
    </div>
    <section
      v-show="isInBuiltRequestDemo()"
      id="view_stream_nav_buttons_section"
    >
      <div id="view_stream_nav_buttons_panel">
        <v-ons-button id="endStreamButton" @click="endViewingStream()">
          End Stream
        </v-ons-button>
      </div>
    </section>
  </v-ons-page>
</template>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/player.css";
@import "../css/viewStream.css";
</style>

<script>
import { mapMutations, mapGetters } from "vuex";

import "webrtc-adapter";

import { WebRTCAdaptor } from "@/js/webrtc_adaptor.js";

import SupplyStream from "@/components/SupplyStream.vue";

export default {
  name: "viewStream",
  // props:{
  //     inBuiltRequest:Boolean
  // },
  data() {
    return {
      webRTCAdaptor: null,
      streamId1: "streamId",
      streamId: "stream2",
      pc_config: null,
      sdpConstraints: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      },
      mediaConstraints: {
        video: false,
        audio: false
      },
      streamNameBox: "stream1",
      inBuiltRequest: true,
      viewControlPanelView: false,
      PayToUserName: "@ma06rii",
      streamingPaused: false,
      metaTag: null,
      config: null,
      nearTotalTickerAmount: 0,
      defaultTipAmount: 1.0
    };
  },
  methods: {
    ...mapMutations({
      _setInBuiltRequestDemo: "setInBuiltRequestDemo"
    }),
    ...mapGetters({
      isInBuiltRequestDemo: "isInBuiltRequestDemo"
    }),
    pauseViewingStream() {},
    playViewingStream() {
      document.getElementById("inBuiltVideoExample").play();
      this.streamingPaused = false;
    },
    report() {},
    pushToSupplyStreamPage() {
      this.$emit("push-page", SupplyStream);
    },
    playVideo() {
      document.getElementById("remoteVideo").style.display = "block";
      document
        .getElementById("remoteVideo")
        .play()
        .then(function() {
          //autoplay started
          //document.getElementById("play_button").style.display = "none";
        })
        .catch(function() {
          //document.getElementById("play_button").style.display = "block";
          console.log("User interaction needed to start playing");
        });
    },
    startPlaying() {
      this.webRTCAdaptor.play(this.streamId);
    },
    stopPlaying() {
      this.webRTCAdaptor.stop();
    },
    endViewingStream() {
      this.$emit("back-page");
    }
  },
  mounted() {
    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: "wss://app.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: this.mediaConstraints,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraints,
      remoteVideoId: "remoteVideo",
      isPlayMode: true,
      debug: true,
      callback: (info, description) => {
        if (info == "initialized") {
          console.log("initialized");
          this.webRTCAdaptor.getStreamInfo(this.streamId);
        } else if (info == "streamInformation") {
          console.log("stream information");
          this.webRTCAdaptor.play(this.streamId, "762007030599962020550620");
        } else if (info == "play_started") {
          //joined the stream
          console.log("play started");
          document.getElementById("video_info").style.display = "none";
          this.playVideo();
        } else if (info == "play_finished") {
          //leaved the stream
          console.log("play finished");
          //check that publish may start again
          setTimeout(function() {
            this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        } else if (info == "closed") {
          //console.log("Connection closed");
          if (typeof description != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(description));
          }
        }
      },
      callbackError: function(error) {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        console.log("error callback: " + JSON.stringify(error));

        if (error == "no_stream_exist") {
          setTimeout(function() {
            //this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        }
        //alert(JSON.stringify(error));
      }
    });
  }
};
</script>
