<template>
  <v-ons-page id="supplyStreamPage">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="closeVideoStream"></v-ons-back-button>
      </div>
      <div class="center">Supply Stream</div>
    </v-ons-toolbar>
    <div class="container">
      <div class="jumbotron">
        <p>
          <video id="localVideo" autoplay muted controls playsinline></video>
        </p>
        <v-ons-input
          type="text"
          class="form-control"
          v-model="streamNameBox"
          id="streamName"
          placeholder="Type stream name"
        ></v-ons-input>
        <p>
          <v-ons-button
            @click="startPublishing"
            class="btn btn-info"
            :disabled="start_publish_button.disabled"
            id="start_publish_button"
          >Start Publishing</v-ons-button>
          <v-ons-button
            @click="stopPublishing"
            class="btn btn-info"
            :disabled="stop_publish_button.disabled"
            id="stop_publish_button"
          >Stop Publishing</v-ons-button>
        </p>

        <span class="label label-success" id="broadcastingInfo">Publishing</span>
      </div>
    </div>
  </v-ons-page>
</template>

<style >
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/player.css";
@import "../css/supplyStream.css";
</style>

<script>
import "webrtc-adapter";
import $ from "jquery";

// import '@/js/fetch.js'
// import '@/js/fetch.stream.js'
// import '@/js/promise.min.js'
import { WebRTCAdaptor } from "@/js/webrtc_adaptor.js";

export default {
  name: "supplyStream",
  data() {
    return {
      start_publish_button: {
        disabled: true
      },
      stop_publish_button: {
        disabled: true
      },
      screen_share_checkbox: "",
      install_extension_link: "",
      //streamNameBox: {value:'stream1'},
      streamNameBox: "stream2",
      streamId: "",
      name: "",
      pc_config: "",
      sdpConstraints: "",
      mediaConstraints: "",
      webRTCAdaptor: ""
    };
  },
  methods: {
    closeVideoStream() {
      this.webRTCAdaptor.closeStream();

      this.webRTCAdaptor.closePeerConnection();

      document.querySelector("ons-navigator").popPage({
        refresh: true
      });
    },
    startPublishing() {
      //this.streamId = this.streamNameBox.value;
      this.streamId = this.streamNameBox;
      this.webRTCAdaptor.publish(this.streamId);
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
      //websocket_url: "ws://ec2-18-141-162-55.ap-southeast-1.compute.amazonaws.com:5080/WebRTCAppEE/websocket",
      websocket_url: "ws://app.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: this.mediaConstraints,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraints,
      localVideoId: "localVideo",
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
