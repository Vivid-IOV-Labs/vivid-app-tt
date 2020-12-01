import Vue from "vue";
import Vuex from "vuex";

import requests from "./requests";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    requests
  },
  strict: debug
});
