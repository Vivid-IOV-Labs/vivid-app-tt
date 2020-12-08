import RequestService from "@/services/RequestService";
import FlagService from "@/services/FlagService";

import env from "@/env.js";

import getWeb3 from "@/util/getWeb3";
import devLog from "@/util/devlog.js";

export default {
  namespaced: true,
  state: {
    baseURL: env.web_service_url,
    myWalletAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    searchLocation: null,
    localCopyOfRequestPins: null,
    selectedPin: null,
    streamerWalletAddress: null,
    myPosition: null,
    // web3: {
    //   isInjected: false,
    //   web3Instance: null,
    //   networkId: null,
    //   coinbase: null,
    //   balance: null,
    //   error: null
    // },
    web3: {
      isInjected: false,
      web3Instance: null,
      chianId: null,
      error: null,
      ethereum: null,
      network: null,
      signer: null,
      signerAddress: null,
      signerBalance: null
    },
    contractInstance: null
  },
  mutations: {
    // setRequestPin(state, newPin) {
    //  const pinToUpdate state.localCopyOfRequestPins.find(pin => {
    //     return pin.openLocationCode == newPin.openLocationCode;
    //   });
    // },
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
    // setChainID(state, n) {
    //   state.web3.networkId = n;
    // },
    // setIsInjected(state, n) {
    //   state.web3.isInjected = n;
    // },
    setWeb3Instance(state, n) {
      state.web3.web3Instance = n;
    },
    setSignerBalance(state, n) {
      state.web3.signerBalance = parseInt(n, 10);
    },
    setSignerAddress(state, n) {
      state.web3.signerAddress = n;
    },
    setSigner(state, n) {
      state.web3.signer = n;
    },
    setNetwork(state, n) {
      state.web3.network = n;
    },
    setWindowEthereum(state, n) {
      state.web3.ethereum = n;
    },
    setPosition(state, position) {
      state.myPosition = position;
    }
  },
  getters: {
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
    registerWeb3ProviderInstance({ commit }, payload) {

      // commit("setChainID", payload.chainId);
      // commit("setIsInjected", payload.injectedWeb3);
      commit("setWeb3Instance", payload.web3);
      commit("setSignerBalance", payload.signerBalance);
      commit("setSignerAddress", payload.signerAddress);
      commit("setSigner", payload.signer);
      commit("setNetwork", payload.network);
      commit("setWindowEthereum", payload.ethereum);

      commit("setMyWalletAddress", payload.signerAddress);

    },
    getWeb3Provider({ dispatch }) {
      getWeb3
        .then(result => {
          devLog("committing result to registerWeb3Instance mutation");
          dispatch("registerWeb3ProviderInstance", result);
          devLog(result);
        })
        .catch(e => {
          devLog("Error in action requestWeb3", e);
        });
    },
    async update({ state }, model) {
      let response = await RequestService.update(model, state);
      return response;
    }
  }
};
