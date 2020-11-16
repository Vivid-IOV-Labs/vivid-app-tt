// Webpack CSS import
import "onsenui/css/onsenui-core.min.css";
import "onsenui/css/onsen-css-components.min.css";

import Vue from "vue";
import VueOnsen from "vue-onsenui";
Vue.use(VueOnsen);
import BaseIcon from "@/components/BaseIcon";

Vue.component("BaseIcon", BaseIcon);
//THIS IS TO IMPORT THE 'VUEX' STORE TO BE USED IN THE VUE APP.
import store from "./store";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
