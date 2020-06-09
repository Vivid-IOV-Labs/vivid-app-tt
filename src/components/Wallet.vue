<template>
<v-ons-page id="walletPage">
    <v-ons-card style="text-align:center">
        <div class="title">Balance</div>
        <div class="content">
            <strong><span>{{`NEAR ${ parseFloat(walletService()).toFixed(2)}`}}</span></strong>
        </div>
    </v-ons-card>

    <section id="wallet_transaction_buttons" style="text-align: center;">
        <div style="display:block">
            <v-ons-button style="margin-top: 1em; margin-right:2em; width:5em; background-color:indigo">Send</v-ons-button>
            <v-ons-button style="margin-top: 1em; margin-left:2em; width: 5em; background-color:indigo">Receive</v-ons-button>
        </div>
    </section>
</v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/wallet.css";
</style>

<script>
export default {
    name: "wallet",
    inject: ["walletService"],
    data() {
        return {
          
        };
    }
};
</script>
