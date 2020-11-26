<template>
  <v-ons-page id="Streamer">
    <div class="streamer__container">
      <div class="streamer__controls streamer__controls--top">
        <v-ons-button class="btn btn--small btn--opacity-soft  flex-center-xy">
          <base-icon class="btn__icon" name="user"></base-icon>
          <span class="ml-2">101</span>
        </v-ons-button>

        <v-ons-button
          class="btn btn--small btn--opacity-soft ml-auto  flex-center-xy"
        >
          <base-icon class="btn__icon" name="clock"></base-icon>
          <time class="ml-2">{{ currentTime }}</time>
        </v-ons-button>
      </div>
      <base-video ref="videoplayer" :options="videoOptions"></base-video>

      <div class="streamer__controls streamer__controls--bottom">
        <v-ons-button
          @click="closeVideoStream"
          class="btn btn--opacity-soft btn--full-width"
          v-if="!stop_publish_button.disabled"
          id="stop_publish_button"
          >End Streaming <base-icon class="btn__icon" name="pause"></base-icon
        ></v-ons-button>
      </div>
      <v-ons-alert-dialog
        modifier="rowfooter"
        :title="'Live stream reported'"
        :footer="{
          Ok: closeVideoStream
        }"
        :visible.sync="streamReported"
      >
        This Live stream has been reported and therefor ended
      </v-ons-alert-dialog>
    </div>
  </v-ons-page>
</template>

<script>
import BaseVideo from "@/components/BaseVideo.vue";
import Home from "@/components/Home.vue";

import { WebRTCAdaptor } from "@/util/webrtc_adaptor.js";
import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";

import env from "@/env.js";
let io;

if (socketIOClient.sails) {
  io = socketIOClient;
} else {
  io = sailsIOClient(socketIOClient);
  io.sails.url = env.web_service_url;
}
import devLog from "@/util/devlog.js";
/*
const getDevices = async () => {
  const devices = await window.navigator.mediaDevices.enumerateDevices();
  return devices;
};
const getStream = async()=>{
  const stream = await window.navigator.mediaDevices.getUserMedia(
  {
    video: true,
    audio: true,
  });
  return stream;
}
stream.getAudioTracks();
stream.getVideoTracks();

*/
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
        liveui: true,
        fill: true,
        controls: false
      },
      currentTime: "00:00",
      stop_publish_button: {
        disabled: true
      },
      streamNameBox: this.$store.state.selectedPin.openLocationCode,
      streamId: "",
      webRTCAdaptor: "",
      streamReported: false,
      openLocationCode: ""
    };
  },
  computed: {
    liveTime() {
      return "00:00 s";
    }
  },
  methods: {
    closeVideoStream() {
      this.stopPublishing();
      this.webRTCAdaptor.closeStream();
      this.webRTCAdaptor.closePeerConnection();
      this.webRTCAdaptor.closeWebSocket();
      this.$emit("push-page", Home);
    },
    startPublishing() {
      this.streamId = this.streamNameBox;
      this.webRTCAdaptor.publish(this.streamId, "287084795627827033631286");
    },
    stopPublishing() {
      this.webRTCAdaptor.stop(this.streamId);
    }
  },
  mounted() {
    io.socket.on("reportFlagRaisedAndLiveStreamRemoved", ({ data }) => {
      this.openLocationCode = data.openLocationCode;
      this.streamReported = true;
    });
    this.player = window.videojs.getPlayer(this.$refs.videoplayer.$refs.video);

    const pc_config = null;

    const sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    };

    const mediaConstraints = {
      video: true,
      audio: true
    };
    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: "wss://streams.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: mediaConstraints,
      peerconnection_config: pc_config,
      sdp_constraints: sdpConstraints,
      localVideoId: this.player.tech().el(),
      debug: process.env.NODE_ENV != "production",
      callback: (info, description) => {
        if (info == "initialized") {
          devLog("initialized");
          this.stop_publish_button.disabled = true;
          this.startPublishing();
        } else if (info == "publish_started") {
          //stream is being published
          devLog("publish started");
          this.stop_publish_button.disabled = false;
          //this.startAnimation();
        } else if (info == "publish_finished") {
          //stream is being finished
          devLog("publish finished");
          this.stop_publish_button.disabled = true;
        } else if (info == "screen_share_extension_available") {
          //this.screen_share_checkbox.disabled = false;
          //devLog("screen share extension available");
          //this.install_extension_link.style.display = "none";
        } else if (info == "screen_share_stopped") {
          devLog("screen share stopped");
        } else if (info == "closed") {
          devLog("Connection closed");
          if (typeof description != "undefined") {
            devLog("Connecton closed: " + JSON.stringify(description));
          }
        } else if (info == "pong") {
          //ping/pong message are sent to and received from server to make the connection alive all the time
          //It's especially useful when load balancer or firewalls close the websocket connection due to inactivity
        }
      },
      callbackError: (error, message) => {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

        devLog("error callback: " + JSON.stringify(error));
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
    this.player.on("timeupdate", () => {
      function timeToString(totalSecs) {
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = Math.floor(totalSecs % 60);
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");
        return `${formattedMinutes}:${formattedSeconds}`;
      }
      this.currentTime = timeToString(this.player.currentTime());
    });
  }
};
</script>
