<template>
<v-ons-page>
    <v-ons-toolbar>
        <div class="left">
            <v-ons-button style="background-color: Transparent;">
                <ons-icon style="color: #1d1d1b;" size="12px" icon="fa-bars"></ons-icon>
            </v-ons-button>
        </div>
        <div class="center">
            <v-ons-segment tabbar-id="homeTabbar" :index.sync="segmentIndex" style="width: 8em">
                <button>Wallet</button>
                <button>Request</button>
                <!-- <button>Publish</button> -->
            </v-ons-segment>
        </div>
        <div class="right">
            <v-ons-button @click="pushToFilterStreamPage" style="background-color: Transparent;">
                <ons-icon style="color: #1d1d1b;" size="12px" icon="fa-filter"></ons-icon>
            </v-ons-button>
        </div>
    </v-ons-toolbar>

    <v-ons-tabbar id="homeTabbar" :tabs="tabs" :index.sync="tabbarIndex" @push-page="pushToViewStreamPage" @push-supply="pushToSupplyStreamPage" @back-page="popViewPage" @postchange="reHydrate"></v-ons-tabbar>
</v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
</style>

<script>
import RequestStream from "@/components/RequestStream.vue";
import Wallet from "@/components/Wallet.vue";
import RequestStreamFilters from "@/components/RequestStreamFilters.vue";
import ViewStream from "@/components/ViewStream.vue";
//mport PublishStream from "@/components/PublishStream.vue";
import SupplyStream from "@/components/SupplyStream.vue"

// import nearlib from "../../node_modules/nearlib/dist/nearlib.min.js";
// console.log(nearlib)
//console.log(window.nearlib)

export default {
    name: "home",
    data() {
        return {
            tabs: [{
                    page: Wallet,
                    key: "Wallet"
                },
                {
                    page: RequestStream,
                    key: "RequestStream"
                }
                // { page: PublishStream, key: "PublishStream" }
            ],
            tabbarIndex: 1,
            segmentIndex: 1,
            walletBalance2: 0,
            getSender2: null
        };
    },
    methods: {
        log(...args) {
            console.log(...args);
        },
        pushToFilterStreamPage() {
            this.$emit("push-page", {
                extends: RequestStreamFilters,
                onsNavigatorOptions: {
                    animation: "lift",
                    animationOptions: {
                        duration: 0.5
                    }
                }
            });
        },
        pushToViewStreamPage() {
            this.$emit("push-page", ViewStream);
        },
        pushToSupplyStreamPage() {
            this.$emit("push-page", SupplyStream);
        },
        popViewPage() {
            this.$emit("back-page")
        },
        async connectToNear() {

        },
        async reHydrate() {
            this.getSender2 = await window.near.account(window.wallet.getAccountId())
            this.walletBalance2 = (await this.getSender2.state()).amount
        }
    },
    created() {
        const config = {
            networkId: 'default', // this can be any label to namespace user accounts
            nodeUrl: "https://rpc.nearprotocol.com", // this endpoint must point to the network you want to reach
            walletUrl: "http://wallet.nearprotocol.com", // this endpoint must exist for the wallet to work
            deps: {
                keyStore: new window.nearlib.keyStores.BrowserLocalStorageKeyStore() // keys are stored as plaintext in LocalStorage
            }
        };

        // open a connection to the NEAR platform
        (async function () {
            window.near = await window.nearlib.connect(config); // connect to the NEAR platform
            window.wallet = new window.nearlib.WalletAccount(window.near) // instantiate a new wallet

            // ---------------------------------------------------------------------------
            // here you have access to `nearlib` and a valid connection object `near`
            //
            // we've added them to the window object to make working in the console convenient
            // ---------------------------------------------------------------------------

        })(window)

    },
    provide: function () {
        return {
            walletService: () => {
                return window.nearlib.utils.format.formatNearAmount(this.walletBalance2)
            }
        }
    }
};
</script>
