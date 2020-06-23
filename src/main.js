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

// import socketio from 'socket.io';
// import VueSocketIO from 'vue-socket.io';
// export const SocketInstance = socketio('http://localhost:1336');

// Vue.use(VueSocketIO, SocketInstance, store)

// import VueSocketIO from 'vue-socket.io'
// //import SocketIO from "socket.io-client"

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:1336/messages',
//   vuex: {
//     store,
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   },
//   //options: { path: "/my-app/" } //Optional options
// }))


// import VueWebMonetization from 'vuejs-web-monetization'
// Vue.use(VueWebMonetization)

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')