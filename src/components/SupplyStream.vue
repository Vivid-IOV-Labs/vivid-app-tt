<template>
  <v-ons-page id="Streamer">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">Live Stream in progress</span>
      </div>
    </v-ons-toolbar>
    <div class="streamer__container">
      <div class="streamer__controls streamer__controls--top">
        <v-ons-button class="btn btn--default flex-coulumn">
          <v-ons-icon class="btn__icon" icon="fa-eye"></v-ons-icon>
          <span>101</span>
        </v-ons-button>

        <v-ons-button class="btn btn--default ml-auto flex-coulumn">
          <v-ons-icon class="btn__icon" icon="fa-clock"></v-ons-icon>
          <span>{{ liveTime }}</span>
        </v-ons-button>
      </div>
      <base-video ref="videoplayer" :options="videoOptions"></base-video>

      <div class="streamer__controls streamer__controls--bottom">
        <v-ons-button
          @click="startPublishing"
          class="btn btn--golive btn--full-width"
          v-if="!start_publish_button.disabled"
          id="start_publish_button"
          >Start Streaming
          <v-ons-icon class="btn__icon" icon="fa-play"></v-ons-icon>
        </v-ons-button>
        <v-ons-button
          @click="stopPublishing"
          class="btn btn--golive btn--full-width"
          v-if="!stop_publish_button.disabled"
          id="stop_publish_button"
          >End Streaming
          <v-ons-icon class="btn__icon" icon="fa-pause"></v-ons-icon
        ></v-ons-button>
      </div>
      <v-ons-alert-dialog
        modifier="rowfooter"
        :title="'This Live stream has been reported'"
        :footer="{
          Ok: closeVideoStream
        }"
        :visible.sync="streamReported"
      >
        Are you sure you want to report this live stream?
      </v-ons-alert-dialog>
    </div>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>
<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/player.css";
/* @import "../css/supplyStream.css"; */
@import "../css/viewStream.css";
</style>

<script>
import videojs from "video.js";
import BaseVideo from "@/components/BaseVideo.vue";

import "webrtc-adapter";
import $ from "jquery";

import { WebRTCAdaptor } from "@/js/webrtc_adaptor.js";
import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";

import env from "@/js/env.js";
let io;

if (socketIOClient.sails) {
  io = socketIOClient;
} else {
  io = sailsIOClient(socketIOClient);
  io.sails.url = env.web_service_url;
}
export default {
  name: "supplyStream",
  components: {
    BaseVideo
  },
  data() {
    return {
      player: null,
      videoOptions: {
        autoplay: true,
        muted: true,
        controls: false,
        responsive: true,
        fill: true,
        fluid: false
      },
      start_publish_button: {
        disabled: true
      },
      stop_publish_button: {
        disabled: true
      },
      screen_share_checkbox: "",
      install_extension_link: "",
      //streamNameBox: {value:'stream1'},
      //streamNameBox: "stream2",
      streamNameBox: this.$store.state.selectedPin.openLocationCode,
      streamId: "",
      name: "",
      pc_config: "",
      sdpConstraints: "",
      mediaConstraints: "",
      webRTCAdaptor: "",
      streamReported: false,
      openLocationCode: ""
    };
  },
  computed: {
    liveTime() {
      return this.player
        ? this.player.currentTime().toFixed(2) + " s"
        : "00:00 s";
    }
  },
  methods: {
    closeVideoStream() {
      this.webRTCAdaptor.closeStream();

      this.webRTCAdaptor.closePeerConnection();

      document.querySelector("ons-navigator").popPage({
        refresh: true
      });
    },
    closeReportedStream() {
      this.webRTCAdaptor.closeStream();
      this.webRTCAdaptor.closePeerConnection();
      this.$emit("reset-home-page");
    },
    startPublishing() {
      this.streamId = this.streamNameBox;
      this.webRTCAdaptor.publish(this.streamId, "287084795627827033631286");
    },
    stopPublishing() {
      this.webRTCAdaptor.stop(this.streamId);
    },
    enableDesktopCapture(_enable) {
      if (_enable == true) {
        this.webRTCAdaptor.switchDesktopCapture(this.streamId);
      } else {
        this.webRTCAdaptor.switchVideoCapture(this.streamId);
      }
    },
    startAnimation() {
      $("#broadcastingInfo").fadeIn(800, () => {
        $("#broadcastingInfo").fadeOut(800, () => {
          var state = this.webRTCAdaptor.signallingState(this.streamId);
          if (state != null && state != "closed") {
            var iceState = this.webRTCAdaptor.iceConnectionState(this.streamId);
            if (
              iceState != null &&
              iceState != "failed" &&
              iceState != "disconnected"
            ) {
              this.startAnimation();
            }
          }
        });
      });
    }
  },
  mounted() {
    io.socket.on("reportFlagRaisedAndLiveStreamRemoved", ({ data }) => {
      this.openLocationCode = data.openLocationCode;
      this.streamReported = true;
    });
    this.player = videojs.getPlayer(this.$refs.videoplayer.$refs.video);

    this.pc_config = null;

    this.sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    };

    this.mediaConstraints = {
      video: true,
      audio: true
    };
    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: "wss://streams.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: this.mediaConstraints,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraints,
      localVideoId: this.player.tech().el(),
      debug: true,
      callback: (info, description) => {
        if (info == "initialized") {
          console.log("initialized");
          this.start_publish_button.disabled = false;
          this.stop_publish_button.disabled = true;
        } else if (info == "publish_started") {
          //stream is being published
          console.log("publish started");
          this.start_publish_button.disabled = true;
          this.stop_publish_button.disabled = false;
          this.startAnimation();
        } else if (info == "publish_finished") {
          //stream is being finished
          console.log("publish finished");
          this.start_publish_button.disabled = false;
          this.stop_publish_button.disabled = true;
        } else if (info == "screen_share_extension_available") {
          //this.screen_share_checkbox.disabled = false;
          //console.log("screen share extension available");
          //this.install_extension_link.style.display = "none";
        } else if (info == "screen_share_stopped") {
          console.log("screen share stopped");
        } else if (info == "closed") {
          //console.log("Connection closed");
          if (typeof description != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(description));
          }
        } else if (info == "pong") {
          //ping/pong message are sent to and received from server to make the connection alive all the time
          //It's especially useful when load balancer or firewalls close the websocket connection due to inactivity
        }
      },
      callbackError: (error, message) => {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

        console.log("error callback: " + JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != "undefined") {
          errorMessage = message;
        }
        //var errorMessage = JSON.stringify(error);
        if (error.indexOf("NotFoundError") != -1) {
          errorMessage =
            "Camera or Mic are not found or not allowed in your device.";
        } else if (
          error.indexOf("NotReadableError") != -1 ||
          error.indexOf("TrackStartError") != -1
        ) {
          errorMessage =
            "Camera or Mic is being used by some other process that does not not allow these devices to be read.";
        } else if (
          error.indexOf("OverconstrainedError") != -1 ||
          error.indexOf("ConstraintNotSatisfiedError") != -1
        ) {
          errorMessage =
            "There is no device found that fits your video and audio constraints. You may change video and audio constraints.";
        } else if (
          error.indexOf("NotAllowedError") != -1 ||
          error.indexOf("PermissionDeniedError") != -1
        ) {
          errorMessage = "You are not allowed to access camera and mic.";
        } else if (error.indexOf("TypeError") != -1) {
          errorMessage = "Video/Audio is required.";
        } else if (error.indexOf("UnsecureContext") != -1) {
          errorMessage =
            "Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https";
        } else if (error.indexOf("WebSocketNotSupported") != -1) {
          errorMessage = "Fatal Error: WebSocket not supported in this browser";
        }

        alert(errorMessage);
      }
    });
  }
};
</script>
<style>
.streamer__container {
  width: 100%;
  height: 100%;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.streamer__controls {
  padding: 1rem;
  position: absolute;
  z-index: 9999;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.streamer__controls--bottom {
  bottom: 1.2rem;
  align-items: flex-end;
}
.streamer__controls--top {
  top: 1.2rem;
  align-items: flex-start;
}
.streamer__container .vjs-tech {
  object-fit: cover;
  min-height: 100%; /* not good for the aspect ratio set square or landscape or vertical instead*/
}
.flex-coulumn {
  display: flex;
  flex-direction: column;
}
.btn {
  text-align: center;
  background-color: #6d6d3d;
  font-weight: 550;
  border-radius: 0.3rem;
  padding: 0.4rem 0.6rem;
  text-align: center;
  background-color: #1d1d1b;
  font-weight: 550;
  border-radius: 0.3rem;
  height: fit-content;
  padding: 0.6rem 0.8rem;
}
.btn__icon {
  margin-left: 0.2rem;
}
.btn--default {
  background: #fff;
}
.btn--default .btn__icon {
  margin-left: 0.2rem;
  font-size: 1.2rem;
  color: #1d1d1b;
}
.btn--full-width {
  width: 100%;
}
.btn--join {
  border: solid 1px #73e335;
  color: #73e335;
}
.btn--request {
  border: solid 1px #16dbdb;
  color: #16dbdb;
}
.ml-auto {
  margin-left: auto;
}
.btn--golive {
  border: solid 1px #f73e2d;
  color: #f73e2d;
}
</style>
