<template>
  <v-ons-page id="Streamer">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>Back</v-ons-back-button>
      </div>
      <div class="center">
        <span class="onsPageTitleStyle">Streaming</span>
      </div>
    </v-ons-toolbar>
    <div class="streamer__container">
      <div class="streamer__controls streamer__controls--top">
        <v-ons-button class="btn btn--default flex-coulumn">
          <v-ons-icon class="btn__icon" icon="fa-eye"></v-ons-icon>
          <span>101</span>
        </v-ons-button>

        <v-ons-button class="btn btn--default ml-auto" @click="muteUnmute">
          <span v-if="isMute">
            <v-ons-icon class="btn__icon" icon="fa-volume-mute"></v-ons-icon>
          </span>
          <span v-else>
            <v-ons-icon class="btn__icon" icon="fa-volume-up"></v-ons-icon>
          </span>
        </v-ons-button>
      </div>
      <base-video
        ref="videoplayer"
        :options="videoOptions"
        @pause="isPaused = true"
        @play="isPaused = false"
      ></base-video>

      <div class="streamer__controls streamer__controls--bottom">
        <v-ons-button class="btn btn--golive" @click="playPause">
          <span v-if="isPaused">
            Start Streaming
            <v-ons-icon class="btn__icon" icon="fa-play"></v-ons-icon>
          </span>
          <span v-else>
            End Stream
            <v-ons-icon class="btn__icon" icon="fa-pause"></v-ons-icon>
          </span>
        </v-ons-button>
        <a class="btn-tip ml-auto" @click.prevent="tipStreamer()">
          <img src="../assets/tipping.png" alt />
        </a>
      </div>
    </div>
    <v-ons-bottom-toolbar style="background-color: #1d1d1b !important;"></v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import videojs from "video.js";
import Web3 from "web3";
import { address, ABI } from "@/util/constants/tippingContract";

import { mapMutations, mapGetters } from "vuex";
import BaseVideo from "@/components/BaseVideo.vue";
/**
ffmpeg -re -i https://eric-test-livepeer.s3.amazonaws.com/bbb_1080p.mp4 -c:v copy -c:a copy -f flv rtmp://chi-origin.livepeer.live/bf2d-r2cd-ul0i/mmcb+bbb_test
 
 https://v0chi.lp-distro.com/mmcb%2Bbbb_test/index.m3u8

 https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
 */
export default {
  name: "Streamer",
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
            src: "https://fra-cdn.livepeer.com/hls/wt8fwav9t1ulj75u/index.m3u8",
            type: "application/x-mpegURL"
          }
        ]
      },
      isPaused: false,
      isMute: false,
      player: null,
      //Ike 0xca14007073589C4F4d48116AD4393c81f03D401A
      //Daniele 0xD249F5A7Bcbd0E291f41Db7acD7b8E0388dc9f25
      walletAddress: "0xca14007073589C4F4d48116AD4393c81f03D401A"
    };
  },
  components: {
    BaseVideo
  },
  mounted() {
    this.player = videojs.getPlayer(this.$refs.videoplayer.$refs.video);
    this._setStreamerWalletAddress(this.walletAddress);
  },

  methods: {
    ...mapMutations({
      _setStreamerWalletAddress: "setStreamerWalletAddress"
    }),
    ...mapGetters({
      _myWalletAddress: "myWalletAddress",
      _getStreamerWalletAddress: "getStreamerWalletAddress"
    }),
    playPause() {
      if (this.isPaused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    },
    muteUnmute() {
      if (!this.isMute) {
        this.isMute = true;
        this.player.muted(true);
      } else {
        this.isMute = false;
        this.player.muted(false);
      }
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
  align-items: center;
}
.streamer__controls--bottom {
  bottom: 1.2rem;
}
.streamer__controls--top {
  top: 1.2rem;
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
  height: 5rem;
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
.btn--golive {
  border: solid 1px #f73e2d;
  color: #f73e2d;
}
</style>
