<template>
<v-ons-page id="loginPage">
    <div id="loginContainer">
        <h1 id="appHeading">VIVID</h1>
        <h2 id="appSubHeading">On Demand Live Streaming</h2>
        <v-ons-button id="loginButton" @click="loginUser">{{'Login'}}</v-ons-button>
        <span id="authenticationNote">{{'On Near Platform'}}</span>
    </div>
</v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/login.css";
</style>

<script>
import Home from "@/components/Home.vue";

export default {
    name: "login",
    data() {
        return {

        };
    },
    methods: {
        loginUser() {
            window.wallet.requestSignIn(
                "",
                // This is the app name. It can be anything.
                "vivid-app-demo"
            )
        }
    },
    mounted() {
        const config = {
            networkId: 'default', // this can be any label to namespace user accounts
            nodeUrl: "https://rpc.nearprotocol.com", // this endpoint must point to the network you want to reach
            walletUrl: "http://wallet.nearprotocol.com", // this endpoint must exist for the wallet to work
            deps: {
                keyStore: new window.nearlib.keyStores.BrowserLocalStorageKeyStore() // keys are stored as plaintext in LocalStorage
            }
        };

        // open a connection to the NEAR platform
        (async () => {
            window.near = await window.nearlib.connect(config); // connect to the NEAR platform
            window.wallet = new window.nearlib.WalletAccount(window.near) // instantiate a new wallet

            let isUserSignedIn = await window.wallet.isSignedIn()

            if (isUserSignedIn) {
                this.$emit("reset-home-page", Home)
            }

            // ---------------------------------------------------------------------------
            // here you have access to `nearlib` and a valid connection object `near`
            //
            // we've added them to the window object to make working in the console convenient
            // ---------------------------------------------------------------------------

        })(window)

    }
};
</script>
