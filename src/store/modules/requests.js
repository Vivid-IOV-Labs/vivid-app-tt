import RequestService from "@/services/RequestService";
import FlagService from "@/services/FlagService";

import env from "@/env.js";
import devLog from "@/util/devlog.js";

export default {
  namespaced: true,
  state: {
    baseURL: env.web_service_url,
    searchLocation: null,
    localCopyOfRequestPins: null,
    selectedPin: null,
    myPosition: null
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
    }
  },
  getters: {
    getLocalCopyOfRequestPins: state => state.localCopyOfRequestPins,
    getSelectedPin: state => state.selectedPin,
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
    async update({ state }, model) {
      let response = await RequestService.update(model, state);
      return response;
    }
  }
};
