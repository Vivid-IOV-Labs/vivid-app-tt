import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
import Vue from "vue";
const state = {
  all: [],
  highlighted: [],
  latests: []
};

const getters = {
  getAll: state => state.all,
  getHighlighted: state => state.highlighted,
  getLatests: state => state.latests,
  getById: state => id => {
    return state.all.find(media => media.mediaID === id);
  }
};

const actions = {
  async populateAll({ commit }) {
    try {
      const all = await MediaService.getAll();
      const allSortedByTime = all.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
      commit("setAll", allSortedByTime);
      const latestsSortedByTime = all
        .filter(f => !f.list.highlighted)
        .sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      commit("setLatests", latestsSortedByTime);
      const highlightedSortedByOrder = all
        .filter(f => f.list.highlighted)
        .sort((a, b) => {
          return a.list.order - b.list.order;
        });
      commit("setHighlighted", highlightedSortedByOrder);
    } catch (error) {
      devLog(error);
    }
  }
};

const mutations = {
  setAll(state, all) {
    state.all = all;
  },
  setLatests(state, latests) {
    state.latests = latests;
  },
  setHighlighted(state, highlighted) {
    state.highlighted = highlighted;
  },
  add(state, item) {
    state.all = [...state.all, item];
  },
  delete(state, { mediaID }) {
    state.all = state.all.filter(media => media.mediaID !== mediaID);
  },
  setTotalTip(state, { mediaID, totalTips }) {
    const mediaIndex = state.all.findIndex(media => media.mediaID === mediaID);
    if (
      state.all[mediaIndex] &&
      state.all[mediaIndex].statistics &&
      state.all[mediaIndex].statistics.total
    ) {
      Vue.set(state.all[mediaIndex].statistics.total, "tips", totalTips);
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
