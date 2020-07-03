import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from 'vuex-persistedstate'
import RequestService from "@/js/RequestService";

import env from "@/js/env.js";

Vue.use(Vuex);

//THIS VUEX 'STORE' HAS BEEN CREATED TO ACT AS A CENTRAL PALCE TO
//SAVE INFORMATION THAT CAN BE MADE AVAILABLE TO EVERY COMPONENT IN THE VUE APP.
export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    inBuiltRequestDemo: true,
    //baseURL: 'http://127.0.0.1:1336/',
    baseURL: env.web_service_url,
    myWalletAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
  },
  mutations: {
    setInBuiltRequestDemo(state, n) {
      state.inBuiltRequestDemo = n;
    }
  },
  getters: {
    isInBuiltRequestDemo: state => state.inBuiltRequestDemo,
    myWalletAddress: state => state.myWalletAddress
  },
  actions: {
    async find_all_requests({ state }) {
      const response = await RequestService.find_all_requests({}, state);

      return response;
    },
    async add({ state }, model) {
      const response = await RequestService.add(model, state);

      return response;
    },
    async get_requests({ state }) {
      const response = await RequestService.get_requests(state);

      return response;
    },
    async create({ state }, model) {
      let response;

      let findWhereModel = { openLocationCode: model.openLocationCode };
      const findWhereResponse = await RequestService.findWhere(
        findWhereModel,
        state
      );

      if (!(findWhereResponse.data && findWhereResponse.data.length)) {
        response = await RequestService.create(model, state);
      } else {
        response = "already exists";
        console.log(response);
      }
      return response;
    }
  }
});
