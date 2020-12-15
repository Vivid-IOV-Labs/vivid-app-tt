import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
import Vue from "vue";
const state = {
  all: []
};

const getters = {
  getAll: state => state.all,
  getById: state => id => {
    return state.all.find(media => media.mediaID === id);
  }
};

const actions = {
  async populateAll({ commit }) {
    try {
      const all = await MediaService.getAll();
      commit("setAll", all);
    } catch (error) {
      devLog(error);
    }
  }
};

const mutations = {
  setAll(state, all) {
    state.all = all;
  },
  setTotalTip(state, { mediaID, totalTip }) {
    const mediaIndex = state.all.findIndex(media => media.mediaID === mediaID);
    Vue.set(state.all[mediaIndex].statistics.total, "tips", totalTip);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
