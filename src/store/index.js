import Vue from "vue";
import Vuex from "vuex";

import requests from "./modules/requests";
import smartcontract from "./modules/smartcontract";
import media from "./modules/media";
import user from "./modules/user";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    requests,
    smartcontract,
    media,
    user
  },
  strict: debug
});
