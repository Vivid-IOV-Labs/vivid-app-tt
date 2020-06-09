<template>
<v-ons-navigator swipeable :page-stack="pageStack" @push-page="pageStack.push($event)" @back-page="pageStack.pop()" @reset-home-page="pageStack.pop(); pageStack.push($event)"></v-ons-navigator>
</template>

<style>
@import "css/app.css";
</style>

<script>
//import RequestStream from '@/components/RequestStream.vue'
//import Home from "@/components/Home.vue";
import Login from "@/components/Login.vue"

export default {
    name: "main_page",
    // components:{
    //     Home
    // },
    data() {
        return {
            pageStack: [Login]
        };
    }
    //   mounted() {
    //     this.importAll(
    //       require.context(
    //         "../node_modules/leaflet-extra-markers/dist/img",
    //         true,
    //         /\.png$/
    //       )
    //     );
    //   }
    //,

};
</script>
