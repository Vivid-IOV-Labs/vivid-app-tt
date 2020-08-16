<template>
  <v-ons-page id="Streamer">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">Broadcaster</span>
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
          <span>00:00</span>
        </v-ons-button>
      </div>
      <base-video ref="videoplayer" :options="videoOptions"></base-video>

      <div class="streamer__controls streamer__controls--bottom">
        <v-ons-button
          class="btn btn--golive btn--full-width"
          @click="endBroadCasting"
          v-if="isConnecting"
        >
          End stream
        </v-ons-button>
        <v-ons-button
          class="btn btn--golive btn--full-width"
          @click="startBrodcasting"
          v-else
        >
          Start stream
        </v-ons-button>
      </div>
    </div>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import videojs from "video.js";
import BaseVideo from "@/components/BaseVideo.vue";
/**
ffmpeg -re -i https://eric-test-livepeer.s3.amazonaws.com/bbb_1080p.mp4 -c:v copy -c:a copy -f flv rtmp://chi-origin.livepeer.live/bf2d-r2cd-ul0i/mmcb+bbb_test
 
 https://v0chi.lp-distro.com/mmcb%2Bbbb_test/index.m3u8

 https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
 */
export default {
  name: "Broadcaster",
  data() {
    return {
      videoOptions: {
        autoplay: true,
        muted: false,
        controls: false,
        responsive: true,
        fill: true,
        fluid: false,
        sources: [
          {
            src: "https://v0chi.lp-distro.com/mmcb%2Bbbb_test/index.m3u8",
            type: "application/x-mpegURL"
          }
        ]
      },
      isPaused: false,
      isConnecting: false,
      player: null,
      peerconnection: null,
      rtmpUri: "rtmp://fra-rtmp.livepeer.com/live",
      streamKey: "yzkf-5fpw-9cgu-923l",
      protocol: window.location.protocol == "https:" ? "wss://" : "ws://"
    };
  },
  components: {
    BaseVideo
  },
  computed: {
    testWS() {
      return new WebSocket(this.protocol + window.location.host + "/echo");
    }
  },
  mounted() {
    this.player = videojs.getPlayer(this.$refs.videoplayer.$refs.video);
    this.testWS.onmessage = event => {
      console.log("Hey cool, a message!", event.data);
      var msg = JSON.parse(event.data);

      switch (msg.type) {
        case "answer":
          console.log("Received an answer to my call");

          this.peerconnection.setRemoteDescription(msg).catch(this.reportError);

          break;

        case "ice-candidate":
          console.log("Got a candidate");

          if (msg.candidate == null) {
            console.log("Last candidate received");
          } else {
            var candidate = new RTCIceCandidate(msg.candidate);
            this.peerconnection
              .addIceCandidate(candidate)
              .catch(this.reportError);
          }

          break;

        default:
          console.log("Ignoring unknown message type: ", msg);
          break;
      }
    };
  },

  methods: {
    startBrodcasting() {
      this.createPeerConnection();
      this.isConnecting = true;
    },
    endBroadCasting() {
      this.peerconnection.close();
      this.mediaStream.stop();
      this.isConnecting = false;
    },
    reportError(event) {
      console.log("Error:", event);
    },
    createPeerConnection() {
      this.peerconnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302"
          }
        ]
      });

      this.peerconnection.onicecandidate = event => {
        console.log("onicecandidate", event);
        if (event.candidate == null) {
          console.log("Last candidate received");
        } else {
          this.testWS.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate
            })
          );
        }
      };

      this.peerconnection.onicecandidateerror = function(event) {
        console.log("onicecandidateerror", event);
      };

      this.peerconnection.onnegotiationneeded = function(event) {
        console.log("onnegotiationneeded", event);
      };

      this.peerconnection.oniceconnectionstatechange = function(event) {
        console.log("oniceconnectionstatechange", event);
      };

      this.peerconnection.onicegatheringstatechange = function(event) {
        console.log("onicegatheringstatechange", event);
      };

      this.peerconnection.onsignalingstatechange = function(event) {
        console.log("onsignalingstatechange", event);
      };

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(localStream => {
          this.mediaStream = localStream;
          this.mediaStream
            .getTracks()
            .forEach(track => this.peerconnection.addTrack(track, localStream));
          this.mediaStream.stop = () => {
            this.mediaStream.getTracks().forEach(function(track) {
              track.stop();
            });
          };
          const vid = this.player.tech().el();
          vid.srcObject = this.mediaStream;
          this.peerconnection
            .createOffer()
            .then(offer => {
              return this.peerconnection.setLocalDescription(offer);
            })
            .then(() => {
              var msg = {
                rtmp_uri: this.rtmpUri.value + "/" + this.streamKey.value,
                sdp: this.peerconnection.localDescription.sdp,
                type: this.peerconnection.localDescription.type
              };
              var sdpMsg = JSON.stringify(msg);
              this.testWS.send(sdpMsg);
            })
            .catch(this.reportError);
        })
        .catch(event => {
          console.log("Error doing media stuff: ", event);
        });
    }
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
