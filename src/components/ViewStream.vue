<template>
  <v-ons-page id="viewStreamPage">
    <v-ons-toolbar
      :style="{
        visibility: !isFullScreen ? 'visible' : 'hidden',
        height: !isFullScreen ? 'auto' : 0
      }"
      v-show="!isFullScreen"
    >
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
        <v-ons-button class="btn btn--default flex-column flex-center-xy">
          <base-icon class="btn__icon" name="eye"></base-icon>
          <span>101</span>
        </v-ons-button>
        <div class="ml-auto flex-column">
          <v-ons-button @click="dropVideoMenu" class="btn btn--small mb-2">
            <base-icon
              v-if="isVideoMenuDropped"
              class="btn__icon"
              name="minus"
            ></base-icon>
            <base-icon v-else class="btn__icon" name="plus"></base-icon>
          </v-ons-button>
          <transition name="vide-menu">
            <div
              v-show="isVideoMenuDropped"
              class="video__controls__menu flex-column"
            >
              <v-ons-button class="btn btn--opacity btn--small mb-2">
                <base-icon class="btn__icon" name="volume-mute"></base-icon>
              </v-ons-button>
              <v-ons-button
                @click="toggleFullScreen"
                class="btn btn--opacity btn--small mb-2"
              >
                <base-icon class="btn__icon" name="expand"></base-icon>
              </v-ons-button>
              <v-ons-button class="btn btn--opacity btn--small  mb-2">
                <base-icon class="btn__icon" name="shopping-cart"></base-icon>
              </v-ons-button>
              <v-ons-button
                @click="reportConfirm = true"
                class="btn btn--opacity btn--small "
              >
                <base-icon class="btn__icon" name="flag"></base-icon>
              </v-ons-button>
            </div>
          </transition>
        </div>
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
          <a class="btn-tip " @click.prevent="tipStreamer()">
            <img src="../assets/img/tipping.png" alt />
          </a>
        </div>
      </div>
    </div>
    <v-ons-bottom-toolbar
      :style="{
        visibility: !isFullScreen ? 'visible' : 'hidden',
        height: !isFullScreen ? 'auto' : 0
      }"
      v-show="!isFullScreen"
    ></v-ons-bottom-toolbar>
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
      This Live stream has been ended
    </v-ons-alert-dialog>
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'Live stream reported'"
      :footer="{
        Ok: endViewingStream
      }"
      :visible.sync="streamEnded"
    >
      This Live stream has been ended by the publisher
    </v-ons-alert-dialog>
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'Stream not live'"
      :visible.sync="streamNotLive"
      :footer="{
        Ok: () => (streamNotLive = false)
      }"
    >
      Stream will start playing automatically
      <br />when it is live
    </v-ons-alert-dialog>
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'Stream not found'"
      :visible.sync="streamNotFound"
      :footer="{
        Ok: endViewingStream
      }"
    >
      This Stream does not exist or has ended
    </v-ons-alert-dialog>
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
const pc_config = null;
const sdpConstraints = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true
};
const mediaConstraints = {
  video: false,
  audio: false
};
export default {
  name: "viewStream",
  components: {
    BaseVideo
  },
  data() {
    return {
      player: null,
      videoOptions: {
        muted: true,
        liveui: true,
        fill: true,
        responsive: true,
        controls: true
      },
      isVideoMenuDropped: false,
      webRTCAdaptor: null,
      streamId: this.$store.state.selectedPin.openLocationCode,
      streamNotLive: false,
      streamReported: false,
      streamEnded: false,
      streamNotFound: false,
      reportConfirm: false,
      isFullScreen: false
    };
  },
  // computed: {
  //   isFullScreen() {
  //     return this.player.isFullscreen();
  //   }
  // },
  methods: {
    ...mapMutations({
      _setStreamerWalletAddress: "setStreamerWalletAddress"
    }),
    ...mapGetters({
      _myWalletAddress: "myWalletAddress"
    }),
    ...mapActions({
      _addFlag: "addFlag"
    }),
    pushToSupplyStreamPage() {
      this.$emit("push-page", SupplyStream);
    },
    playVideo() {
      this.player
        .tech()
        .el()
        .play();
    },
    toggleFullScreen() {
      if (!this.isFullScreen) {
        this.player.enterFullWindow();
        this.isFullScreen = true;
      } else {
        this.player.exitFullWindow();
        this.isFullScreen = false;
      }
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
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
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
    io.socket.on("livestreamended", ({ data }) => {
      if (data.openLocationCode == this.streamId) {
        this.streamEnded = true;
      }
    });
    this.player = window.videojs.getPlayer(this.$refs.videoplayer.$refs.video);

    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: "wss://streams.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: mediaConstraints,
      peerconnection_config: pc_config,
      sdp_constraints: sdpConstraints,
      remoteVideoId: this.player.tech().el(),
      isPlayMode: true,
      debug: process.env.NODE_ENV != "production",
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
          this.streamNotLive = false;
          this.playVideo();
        } else if (info == "play_finished") {
          //leaved the stream
          devLog("play finished");
          //check that publish may start again
          this.streamNotFound = true;

          setTimeout(function() {
            this.webRTCAdaptor.getStreamInfo(this.streamId);
          }, 3000);
        } else if (info == "closed") {
          devLog("Connection closed");
          if (typeof description != "undefined") {
            devLog("Connecton closed: " + JSON.stringify(description));
          }
        }
      },
      callbackError: error => {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        devLog("error callback: " + JSON.stringify(error));
        this.streamNotLive = false;
        this.streamNotFound = true;
        if (error == "no_stream_exist") {
          // setTimeout(function() {
          //   this.webRTCAdaptor.getStreamInfo(this.streamId);
          // }, 3000);
        }
        devLog(JSON.stringify(error));
      }
    });
  }
};
</script>
<style>
.vide-menu-enter-active,
.vide-menu-leave-active {
  transition: all 0.5s;
}
.vide-menu-enter,
.vide-menu-leave-to {
  transform: translateX(1rem);
  opacity: 0;
}

.vide-menu-move {
  transition: all 0.5s;
}
</style>
