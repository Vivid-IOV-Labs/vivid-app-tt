<template>
  <v-ons-page id="viewStreamPage">
    <div class="stream__container">
      <div class="stream__controls stream__controls--top">
        <v-ons-button class="btn btn--small btn--opacity-soft   flex-center-xy">
          <base-icon class="btn__icon" name="user"></base-icon>
          <span class="ml-2">101</span>
        </v-ons-button>
        <div class="ml-auto flex">
          <v-ons-button
            @click="reportConfirm = true"
            class="btn btn--square  btn--opacity-soft btn--small "
          >
            <base-icon class="btn__icon" name="flag"></base-icon>
          </v-ons-button>
          <div class="flex-column ml-2">
            <v-ons-button
              @click="endStream = true"
              class="btn btn--small btn--opacity-soft btn--square mb-2"
            >
              <base-icon class="btn__icon" name="times"></base-icon>
            </v-ons-button>
            <v-ons-button
              @click="dropVideoMenu"
              class="btn btn--small  btn--opacity-soft btn--square mb-2"
            >
              <base-icon class="btn__icon" name="menu-dots"></base-icon>
            </v-ons-button>
            <transition name="vide-menu">
              <div
                v-show="isVideoMenuDropped"
                class="video__controls__menu flex-column"
              >
                <v-ons-button
                  class="btn btn--square  btn--opacity-soft btn--small mb-2"
                >
                  <base-icon class="btn__icon" name="volume-mute"></base-icon>
                </v-ons-button>
                <v-ons-button
                  class="btn btn--square  btn--opacity-soft btn--small  mb-2"
                >
                  <base-icon class="btn__icon" name="shopping-cart"></base-icon>
                </v-ons-button>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <base-video ref="videoplayer" :options="videoOptions"></base-video>
      <div class="stream__controls stream__controls--bottom">
        <div class="flex-column stream-detail">
          <h5 class="stream-detail__title">
            {{ details }}
          </h5>
          <p class="stream-detail__hashtag">
            {{ hashtags }}
          </p>
        </div>

        <div class=" ml-auto flex-column ">
          <a @click.prevent="tipStreamer()" class="btn-tip mb-2">
            <img src="@/assets/img/thundercore-logo.svg" />
          </a>
        </div>
      </div>
    </div>
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
      :title="'Live stream ended'"
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
    <v-ons-alert-dialog
      modifier="rowfooter"
      :title="'End live stream'"
      :footer="{
        Ok: endViewingStream,
        Cancel: () => (endStream = false)
      }"
      :visible.sync="endStream"
    >
      Are you sure you want to end this live stream
    </v-ons-alert-dialog>
  </v-ons-page>
</template>
<script>
import BaseVideo from "@/components/BaseVideo.vue";
import Web3 from "web3";
import { address, ABI } from "@/util/constants/tippingContract";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("requests");
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
        controls: false
      },
      isVideoMenuDropped: false,
      webRTCAdaptor: null,
      streamId: this.$store.state.selectedPin.openLocationCode,
      streamNotLive: false,
      streamReported: false,
      streamEnded: false,
      streamNotFound: false,
      endStream: false,
      reportConfirm: false
    };
  },
  computed: {
    details() {
      return this.getSelectedPin().mapPin.details;
    },
    hashtags() {
      return this.getSelectedPin()
        .mapPin.twitterHashTags.reduce((acc, tag) => {
          acc += ` #${tag},`;
          return acc;
        }, "")
        .slice(1, -1);
    }
  },
  methods: {
    ...mapGetters(["getSelectedPin", "myWalletAddress"]),
    ...mapActions(["addFlag"]),
    playVideo() {
      this.player.play();
    },
    startPlaying() {
      this.webRTCAdaptor.play(this.streamId);
    },
    stopPlaying() {
      this.webRTCAdaptor.stop();
    },
    endViewingStream() {
      this.$router.push({ path: "home" });
    },
    dropVideoMenu() {
      this.isVideoMenuDropped = !this.isVideoMenuDropped;
    },
    async reportUser() {
      const body = {
        walletAddress: this.myWalletAddress(),
        openLocationCode: this.streamId
      };
      await this.addFlag(body);
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
    io.socket.on("request-deleted-flag-reported", ({ data }) => {
      if (data.openLocationCode == this.streamId) {
        this.streamReported = true;
      }
    });
    io.socket.on("request-deleted", ({ data }) => {
      if (data.openLocationCode == this.streamId) {
        this.streamEnded = true;
      }
    });
    this.player = this.$refs.videoplayer.$refs.video;

    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: "wss://streams.vividiov.media:5443/WebRTCAppEE/websocket",
      mediaConstraints: mediaConstraints,
      peerconnection_config: pc_config,
      sdp_constraints: sdpConstraints,
      remoteVideoId: this.player,
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
<style lang="scss">
.vide-menu-enter-active,
.vide-menu-leave-active {
  transition: all 0.5s;
}
.vide-menu-enter,
.vide-menu-leave-to {
  transform: translateX(1rem);
  opacity: 0;
}
* {
  transition: all;
}
.vide-menu-move {
  transition: all 0.5s;
}
</style>
