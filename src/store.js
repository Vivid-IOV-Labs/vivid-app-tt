import Vue from "vue";
import Vuex from "vuex";
import RequestService from "@/services/RequestService";
import FlagService from "@/services/FlagService";

import env from "@/env.js";

import getWeb3 from "@/util/getWeb3";
import devLog from "@/util/devlog.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    inBuiltRequestDemo: true,
    baseURL: env.web_service_url,
    myWalletAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    searchLocation: null,
    localCopyOfRequestPins: null,
    selectedPin: null,
    streamerWalletAddress: null,
    myPosition: null,
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      coinbase: null,
      balance: null,
      error: null
    },
    contractInstance: null
  },
  mutations: {
    setInBuiltRequestDemo(state, n) {
      state.inBuiltRequestDemo = n;
    },
    setLocalCopyOfRequestPins(state, n) {
      state.localCopyOfRequestPins = n;
    },
    setSelectedPin(state, n) {
      state.selectedPin = n;
    },
    setMyWalletAddress(state, n) {
      state.myWalletAddress = n;
    },
    setStreamerWalletAddress(state, n) {
      state.streamerWalletAddress = n;
    },
    setCoinbase(state, n) {
      state.web3.coinbase = n;
    },
    setNetworkID(state, n) {
      state.web3.networkId = n;
    },
    setBalance(state, n) {
      state.web3.balance = parseInt(n, 10);
    },
    setIsInjected(state, n) {
      state.web3.isInjected = n;
    },
    setWeb3Instance(state, n) {
      state.web3.web3Instance = n;
    },
    setPosition(state, position) {
      state.myPosition = position;
    }
  },
  getters: {
    isInBuiltRequestDemo: state => state.inBuiltRequestDemo,
    myWalletAddress: state => state.myWalletAddress,
    getLocalCopyOfRequestPins: state => state.localCopyOfRequestPins,
    getSelectedPin: state => state.selectedPin,
    getStreamerWalletAddress: state => state.streamerWalletAddress,
    searchLocation: state => state.searchLocation,
    getPosition: state => state.myPosition
  },
  actions: {
    setPosition({ commit }, position) {
      commit("setPosition", position);
    },
    newSearchLocation({ state }, location) {
      state.searchLocation = location;
    },
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
      }
      return response;
    },
    async addFlag({ state }, payload) {
      try {
        const response = await FlagService.add(payload, state);
        return response;
      } catch (err) {
        devLog(err);
      }
    },
    async updateAddress({ state }, payload) {
      try {
        const response = await RequestService.updateAddress(payload, state);
        return response;
      } catch (err) {
        devLog(err);
      }
    },
    registerWeb3Instance2({ commit }, payload) {
      commit("setCoinbase", payload.coinbase);
      commit("setNetworkID", payload.networkId);
      commit("setBalance", payload.balance);
      commit("setIsInjected", payload.injectedWeb3);
      commit("setWeb3Instance", payload.web3);
    },
    registerWeb3({ commit, dispatch }) {
      getWeb3
        .then(result => {
          devLog("committing result to registerWeb3Instance mutation");
          commit("setMyWalletAddress", result.coinbase);
          dispatch("registerWeb3Instance2", result);
          devLog(result);
        })
        .catch(e => {
          devLog("error in action registerWeb3", e);
        });
    },
    async update({ state }, model) {
      let response = await RequestService.update(model, state);
      return response;
    }
  }
});
