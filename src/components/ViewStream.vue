<template>
<v-ons-page id="viewStreamPage">
    <v-ons-toolbar>
        <div class="left">
            <v-ons-back-button @click.prevent="endViewingStream()"></v-ons-back-button>
        </div>
        <div class="center">
            <span class="onsPageTitleStyle">View Stream</span>
        </div>
    </v-ons-toolbar>
    <!-- <div id="view-video-control-panel">
      <v-ons-button id="report-button" @click="report()">Report</v-ons-button>
      <span id="payment-ticker" class="badge badge-pill badge-info">{{"$ " + formattedTotalAmount}}</span>
    </div>-->
    <v-ons-list>
        <v-ons-list-item id="optionsPanel_section_viewStream">
            <div id="pay-info-section">
                <v-ons-button v-show="isInBuiltRequestDemo()" id="payingLabel" class="badge badge-warning">
                    Tip
                    <strong>
                        <!-- <i>{{PayToUserName}}</i> -->
                        <i>User</i>
                    </strong>
                </v-ons-button>
                <!-- <span id="payment-ticker" class="badge badge-pill badge-info">{{"NEAR " + formattedTotalAmountNear}}</span> -->
                <span id="payment-ticker" class="badge badge-pill badge-info">{{ defaultTipAmount + " TT"}}</span>
            </div>
            <div class="expandable-content">
                <div id="options_panel"></div>
            </div>
        </v-ons-list-item>
    </v-ons-list>
    <div id="view-video-panel">
        <div v-show="isInBuiltRequestDemo()" class="container">
            <div class="jumbotron">
                <video id="inBuiltVideoExample" src="../assets/video/santa5.mp4" playsinline></video>
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
    <section v-show="isInBuiltRequestDemo()" id="view_stream_nav_buttons_section">
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
import {
    mapMutations,
    mapGetters
} from 'vuex';

import "webrtc-adapter";
//import $ from 'jquery'
import {
    WebRTCAdaptor
} from "@/js/webrtc_adaptor.js";

import SupplyStream from "@/components/SupplyStream.vue";

// import $ from "jquery";

//import BigNumber from "bignumber.js";

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
            defaultTipAmount:1.00
        };
    },
    computed: {
        // isWebMonetization: function () {
        //     return this.$vueWebMonetizationStart &&
        //         this.$vueWebMonetizationStart.state === "started" ?
        //         true :
        //         false;
        // },
        // formattedTotalAmount: function () {
        //     return new BigNumber(
        //         this.$vueWebMonetizationProgress.totalAmount,
        //         10
        //     ).toFormat();
        // },
        formattedTotalAmountNear: function () {
            return parseFloat(this.nearTotalTickerAmount / (Math.pow(10, 24))).toFixed(4)
        }
    },
    methods: {
        // pauseViewingStream() {
        //   document.getElementById("inBuiltVideoExample").pause();
        //   this.streamingPaused = true;
        //   this.removeWebMonetisationMetaTag()
        // },
        // playViewingStream() {
        //   document.getElementById("inBuiltVideoExample").play();
        //   this.streamingPaused = false;
        //   this.addWebMonetisationMetaTag()
        // },
        ...mapMutations({
            _setInBuiltRequestDemo: 'setInBuiltRequestDemo'

        }),
        ...mapGetters({
            isInBuiltRequestDemo: 'isInBuiltRequestDemo'

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
                .then(function () {
                    //autoplay started
                    document.getElementById("play_button").style.display = "none";
                })
                .catch(function () {
                    //
                    document.getElementById("play_button").style.display = "block";
                    console.log("User interaction needed to start playing");
                });
        },
        startPlaying() {
            this.webRTCAdaptor.play(this.streamId);
        },
        stopPlaying() {
            this.webRTCAdaptor.stop();
        },
        // removeWebMonetisationMetaTag() {
        //     document.querySelector('meta[name="monetization"]').remove()

        // },
        // addWebMonetisationMetaTag() {
        //     this.metaTag = document.createElement('meta')
        //     this.metaTag.name = "monetization"
        //     this.metaTag.content = "$twitter.xrptipbot.com/ma06rii1"

        //     document.head.appendChild(this.metaTag)
        // },
        endViewingStream() {
            //this.removeWebMonetisationMetaTag()
            clearInterval(this.nearPaymentIntervals);
            this.$emit("back-page");

        },
        // async makeNearPayment() {

        //     // replace this with your developer account
        //     let your_developer_account = 'ma06rii'

        //     // all inputs in nearlib are denominated in yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
        //     // use this helper function to convert NEAR to yoctoNEAR
        //     let amount_to_send = window.nearlib.utils.format.parseNearAmount('0.00083333')

        //     let sender, final

        //     // make sure we're still signed in to the wallet
        //     console.assert(window.wallet.isSignedIn(), "looks like you need to sign in again with the user account!")

        //     try {
        //         // hydrate and validate we have the right to act on behalf of the sender account
        //         sender = await window.near.account(window.wallet.getAccountId())

        //         // execute a Transfer transaction using the sendMoney convenience method on the account object
        //         final = await sender.sendMoney(your_developer_account, amount_to_send);

        //         // print out the results
        //         // console.log("transaction id", final.transaction.id)
        //         // console.log("gas used", final.transaction.outcome.gas_burnt)

        //         // celebrate
        //         console.log("success!")
        //         console.log(final.transaction.actions[0].Transfer.deposit)

        //         this.nearTotalTickerAmount = this.nearTotalTickerAmount + parseInt(final.transaction.actions[0].Transfer.deposit)

        //     } catch (error) {
        //         // if anything goes sideways, error handling to the rescue
        //         if (error.type == 'InvalidTxError::NotEnoughBalance') {
        //             this.endViewingStream()
        //         }

        //         console.warn(error.type, error.message)
        //     }

        //     // ---------------------------------------------------------------------------
        //     // here you have access to `nearlib` and a valid connection object `near`
        //     //
        //     // we've added them to the window object to make working in the console convenient
        //     // ---------------------------------------------------------------------------

        // }
    },
    mounted() {

        // this.playViewingStream()

        // $(document).on("postpop", "#navigator", function () {
        //     console.log("postpop");

        //     // if (page.matches('#page3')) {
        //     //     // refresh code
        //     // }
        // });

        this.webRTCAdaptor = new WebRTCAdaptor({
            //websocket_url: "wss://test.antmedia.io:5443/WebRTCAppEE/websocket",
            websocket_url: "ws://ec2-18-141-162-55.ap-southeast-1.compute.amazonaws.com:5080/WebRTCAppEE/websocket",
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
                    this.webRTCAdaptor.play(this.streamId);
                } else if (info == "play_started") {
                    //joined the stream
                    console.log("play started");
                    document.getElementById("video_info").style.display = "none";
                    this.playVideo();
                } else if (info == "play_finished") {
                    //leaved the stream
                    console.log("play finished");
                    //check that publish may start again
                    setTimeout(function () {
                        this.webRTCAdaptor.getStreamInfo(this.streamId);
                    }, 3000);
                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof description != "undefined") {
                        console.log("Connecton closed: " + JSON.stringify(description));
                    }
                }
            },
            callbackError: function (error) {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
                console.log("error callback: " + JSON.stringify(error));

                if (error == "no_stream_exist") {
                    setTimeout(function () {
                        //this.webRTCAdaptor.getStreamInfo(this.streamId);
                    }, 3000);
                }
                //alert(JSON.stringify(error));
            }
        });

        this.config = {
            networkId: 'default', // this can be any label to namespace user accounts
            nodeUrl: "https://rpc.nearprotocol.com", // this endpoint must point to the network you want to reach
            walletUrl: "http://wallet.nearprotocol.com", // this endpoint must exist for the wallet to work
            deps: {
                keyStore: new window.nearlib.keyStores.BrowserLocalStorageKeyStore() // keys are stored as plaintext in LocalStorage
            }
        };

        if (this.isInBuiltRequestDemo()) {
            //this.makeNearPayment()
            this.nearPaymentIntervals = setInterval(() => {
                //this.makeNearPayment()
            }, 3500)

            this.playViewingStream()

        }
    },
    created() {
        // this.config = {
        //     networkId: 'default', // this can be any label to namespace user accounts
        //     nodeUrl: "https://rpc.nearprotocol.com", // this endpoint must point to the network you want to reach
        //     walletUrl: "http://wallet.nearprotocol.com", // this endpoint must exist for the wallet to work
        //     deps: {
        //         keyStore: new window.nearlib.keyStores.BrowserLocalStorageKeyStore() // keys are stored as plaintext in LocalStorage
        //     }
        // };

        // if (this.isInBuiltRequestDemo()) {
        //     this.makeNearPayment()
        //     this.nearPaymentIntervals = setInterval(() => {
        //         this.makeNearPayment()
        //     }, 3500)

        //     this.playViewingStream()

        // }

    },
    beforeDestroy() {
        //this.removeWebMonetisationMetaTag()

    }
};
</script>
