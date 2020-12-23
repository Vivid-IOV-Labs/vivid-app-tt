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
        .filter(f => !f.list || !f.list.highlighted)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      commit("setLatests", latestsSortedByTime);
      const highlightedSortedByOrder = all
        .filter(f => f.list && f.list.highlighted)
        .sort((a, b) => {
          return a.list && a.list.order - b.list && b.list.order;
        });
      commit("setHighlighted", highlightedSortedByOrder);
    } catch (error) {
      devLog(error);
    }
  },
  add({ commit }, newVideo) {
    if (newVideo.list && newVideo.list.highlighted) {
      commit("addHighlighted", newVideo);
    } else {
      commit("addLatest", newVideo);
    }
    commit("add", newVideo);
  },
  delete({ commit }, video) {
    if (video.list && video.list.highlighted) {
      commit("deleteHighlighted", video);
    } else {
      commit("deleteLatest", video);
    }
    commit("delete", video);
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
    state.all = [item, ...state.all];
  },
  addLatest(state, item) {
    state.latests = [item, ...state.latests];
  },
  addHighlighted(state, item) {
    state.highlighted = [item, ...state.highlighted];
  },
  delete(state, { code }) {
    state.all = state.all.filter(media => media.code !== code);
  },
  deleteLatest(state, { code }) {
    state.latests = state.latests.filter(media => media.code !== code);
  },
  deleteHighlighted(state, { code }) {
    state.highlighted = state.highlighted.filter(media => media.code !== code);
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
