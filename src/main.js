// Webpack CSS import
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import VueOnsen from 'vue-onsenui'
Vue.use(VueOnsen)

// import Vuex from 'vuex'
// Vue.use(Vuex)

//THIS IS TO IMPORT THE 'VUEX' STORE TO BE USED IN THE VUE APP.
import store from './store'

// import VueWebMonetization from 'vuejs-web-monetization'
// Vue.use(VueWebMonetization)

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')