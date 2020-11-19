<template>
  <v-ons-page id="viewStreamPage">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="endViewingStream()"
          >Back
        </v-ons-back-button>
      </div>
      <div class="center">
        <span>Trending</span>
      </div>
    </v-ons-toolbar>
    <div class="streamer__container">
      <div class="streamer__controls streamer__controls--top">
        <v-ons-button class="btn btn--default flex-coulumn flex-center-xy">
          <base-icon class="btn__icon" name="eye"></base-icon>
          <span>101</span>
        </v-ons-button>
        <div class="ml-auto flex-coulumn">
          <v-ons-button class="btn btn--default mb-4">
            <base-icon class="btn__icon" name="volume-mute"></base-icon>
          </v-ons-button>
          <v-ons-button @click="fullScreen" class="btn btn--default mb-4">
            <base-icon class="btn__icon" name="expand"></base-icon>
          </v-ons-button>
          <v-ons-button @click="reportConfirm = true" class="btn btn--default ">
            <base-icon class="btn__icon" name="flag"></base-icon>
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
      <div id="video_info">
        Stream will start playing automatically
        <br />when it is live
      </div>
      <base-video ref="videoplayer" :options="videoOptions"></base-video>
      <div class="streamer__controls streamer__controls--bottom">
        <v-ons-button
          id="endStreamButton"
          class="btn btn--default btn--large"
          @click="endViewingStream()"
          >End Stream
          <base-icon class="btn__icon" name="pause"></base-icon>
        </v-ons-button>

        <div class=" ml-auto flex-column ">
          <v-ons-button class="btn btn--default  mb-4">
            <base-icon class="btn__icon" name="shopping-cart"></base-icon>
          </v-ons-button>
          <a class="btn-tip " @click.prevent="tipStreamer()">
            <img src="../assets/img/tipping.png" alt />
          </a>
        </div>
      </div>
    </div>
    <v-ons-bottom-toolbar></v-ons-bottom-toolbar>
  </v-ons-page>
</template>
<script>
import BaseVideo from "@/components/BaseVideo.vue";
import Web3 from "web3";
import { address, ABI } from "@/util/constants/tippingContract";

import { mapMutations, mapGetters, mapActions } from "vuex";

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
import devLog from "@/util/devlog.js";

export default {
  name: "viewStream",
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
        .play();
    },
    fullScreen() {
      this.player.requestFullscreen();
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

      devLog(web3Instance);

      let tippingContract = await window.web3.eth.contract(ABI);
      let tippingContractInstance = await tippingContract.at(address);

      devLog(tippingContract);
      devLog(tippingContractInstance);

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
            devLog(err);
          } else {
            // let TipEvent = tippingContractInstance.Tip()
            // TipEvent.watch((err, result) => {
            //     if (err) {
            //         devLog('could not get event Won()')
            //     } else {
            //         devLog(result)
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
    this.player = window.videojs.getPlayer(this.$refs.videoplayer.$refs.video);

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
          devLog("initialized");
          this.webRTCAdaptor.getStreamInfo(this.streamId);
        } else if (info == "streamInformation") {
          devLog("stream information");
          this.webRTCAdaptor.play(this.streamId, "762007030599962020550620");
        } else if (info == "play_started") {
          //joined the stream
          devLog("play started");
          document.getElementById("video_info").style.display = "none";
          this.playVideo();
        } else if (info == "play_finished") {
          //leaved the stream
          devLog("play finished");
          //check that publish may start again
          setTimeout(function() {
            this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        } else if (info == "closed") {
          //devLog("Connection closed");
          if (typeof description != "undefined") {
            devLog("Connecton closed: " + JSON.stringify(description));
          }
        }
      },
      callbackError: function(error) {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        devLog("error callback: " + JSON.stringify(error));

        if (error == "no_stream_exist") {
          setTimeout(function() {
            this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        }
        devLog(JSON.stringify(error));
      }
    });
  }
};
</script>
<style>
#video_info {
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-family: sans-serif;
  line-height: 45px;
  height: 100%;
  min-height: 100%;
}
</style>
