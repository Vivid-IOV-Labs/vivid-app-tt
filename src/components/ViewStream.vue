<template>
  <v-ons-page id="viewStreamPage">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="endViewingStream()">
          <v-ons-icon
            style="color:#fff"
            class="btn__icon"
            icon="fa-angle-left"
          ></v-ons-icon
        ></v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">Trending</span>
      </div>
    </v-ons-toolbar>
    <div class="streamer__container">
      <div class="streamer__controls streamer__controls--top">
        <v-ons-button class="btn btn--default flex-coulumn">
          <v-ons-icon class="btn__icon" icon="fa-eye"></v-ons-icon>
          <span>101</span>
        </v-ons-button>
        <div class="ml-auto flex-coulumn">
          <v-ons-button class="btn btn--default mb-4">
            <v-ons-icon class="btn__icon" icon="fa-volume-mute"></v-ons-icon>
          </v-ons-button>
          <v-ons-button @click="reportConfirm = true" class="btn btn--default ">
            <v-ons-icon class="btn__icon" icon="fa-flag"></v-ons-icon>
          </v-ons-button>
          <v-ons-alert-dialog
            modifier="rowfooter"
            :title="'Report live stream'"
            :footer="{
              Cancel: () => (reportConfirm = false),
              Ok: reportUser
            }"
            :visible.sync="reportConfirm"
          >
            Are you sure you want to report this live stream?
          </v-ons-alert-dialog>
          <v-ons-alert-dialog
            modifier="rowfooter"
            :title="'Live stream reported'"
            :footer="{
              Ok: endViewingStream
            }"
            :visible.sync="streamReported"
          >
            This Live stream has been reported and therefor ended
          </v-ons-alert-dialog>
        </div>
      </div>
      <div
        id="video_info"
        style="
          height: 100%;
          min-height: 100%; "
      >
        Stream will start playing automatically
        <br />when it is live
      </div>
      <base-video ref="videoplayer" :options="videoOptions"></base-video>
      <div class="streamer__controls streamer__controls--bottom">
        <v-ons-button id="endStreamButton" @click="endViewingStream()"
          >End Stream
          <v-ons-icon class="btn__icon" icon="fa-pause"></v-ons-icon>
        </v-ons-button>

        <div class=" ml-auto flex-column ">
          <v-ons-button class="btn btn--default  mb-4">
            <v-ons-icon class="btn__icon" icon="fa-shopping-cart"></v-ons-icon>
          </v-ons-button>
          <a class="btn-tip " @click.prevent="tipStreamer()">
            <img src="../assets/img/tipping.png" alt />
          </a>
        </div>
      </div>
    </div>
    <v-ons-bottom-toolbar
      style="background-color: #1d1d1b !important;"
    ></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../assets/css/viewStream.css";
</style>

<script>
import videojs from "video.js";
import BaseVideo from "@/components/BaseVideo.vue";
import Web3 from "web3";
import { address, ABI } from "@/util/constants/tippingContract";

import { mapMutations, mapGetters, mapActions } from "vuex";

import "webrtc-adapter";

import { WebRTCAdaptor } from "@/util/webrtc_adaptor.js";

import SupplyStream from "@/components/SupplyStream.vue";
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
export default {
  name: "viewStream",
  // props:{
  //     inBuiltRequest:Boolean
  // },
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
      webRTCAdaptor: null,
      streamId1: "streamId",
      //streamNameBox: "stream2",
      streamId: this.$store.state.selectedPin.openLocationCode,
      streamReported: false,
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
      defaultTipAmount: 1.0,
      reportConfirm: false
    };
  },
  methods: {
    ...mapMutations({
      _setInBuiltRequestDemo: "setInBuiltRequestDemo",
      _setStreamerWalletAddress: "setStreamerWalletAddress"
    }),
    ...mapGetters({
      isInBuiltRequestDemo: "isInBuiltRequestDemo",
      _myWalletAddress: "myWalletAddress"
    }),
    ...mapActions({
      _addFlag: "addFlag"
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
      this.player
        .tech()
        .el()
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
    },
    async reportUser() {
      const body = {
        walletAddress: this._myWalletAddress(),
        openLocationCode: this.streamId
      };
      await this._addFlag(body);
      this.reportConfirm = false;
      this.endViewingStream();
    },
    async tipStreamer() {
      let amount = 1;

      var web3Instance = new Web3(window.web3.currentProvider);

      console.log(web3Instance);

      let tippingContract = await window.web3.eth.contract(ABI);
      let tippingContractInstance = await tippingContract.at(address);

      console.log(tippingContract);
      console.log(tippingContractInstance);

      await tippingContractInstance.tip(
        this._getStreamerWalletAddress(),
        {
          gas: 300000,
          gasPrice: "0x14f46b0400",
          value: window.web3.toWei(String(amount), "ether"),
          from: this.$store.state.web3.coinbase
        },
        err => {
          if (err) {
            console.log(err);
          } else {
            // let TipEvent = tippingContractInstance.Tip()
            // TipEvent.watch((err, result) => {
            //     if (err) {
            //         console.log('could not get event Won()')
            //     } else {
            //         console.log(result)
            //         //Show notification that tip has been sent.
            //     }
            // })
          }
        }
      );
    }
  },
  mounted() {
    io.socket.on("reportFlagRaisedAndLiveStreamRemoved", ({ data }) => {
      if (data.openLocationCode == this.streamId) {
        this.streamReported = true;
      }
    });
    this.player = videojs.getPlayer(this.$refs.videoplayer.$refs.video);

    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: "wss://streams.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: this.mediaConstraints,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraints,
      remoteVideoId: this.player.tech().el(),
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
.btn-tip {
  display: block;
  height: 3.4rem;
  cursor: pointer;
  padding: 0.2rem;
}
.btn-tip img {
  height: 100%;
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
.mb-4 {
  margin-bottom: 1rem;
}
.btn--golive {
  border: solid 1px #f73e2d;
  color: #f73e2d;
}
#video_info {
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-family: sans-serif;
  line-height: 45px;
  height: 100%;
}
</style>
