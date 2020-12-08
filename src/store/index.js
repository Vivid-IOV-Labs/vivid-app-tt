import Vue from "vue";
import Vuex from "vuex";

import requests from "./modules/requests";
import smartcontract from "./modules/smartcontract";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    requests,
    smartcontract
  },
  strict: debug
});
