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

      commit("setAll", all);
      const latestsSortedByTime = all
        .filter(f => !f.list || !f.list.highlighted)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      commit("setLatests", latestsSortedByTime);
      const highlightedSortedByOrder = all
        .filter(f => f.list && f.list.highlighted)
        .sort((a, b) => {
          return b.list.order - a.list.order;
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
    commit("deleteHighlighted", video);
    commit("deleteLatest", video);
    commit("delete", video);
  }
  // async videoViewed({ commit }, { code, userWalletAddress }) {
  //   const views = await MediaService.videoViewed({ code, userWalletAddress });
  //   console.log(views);
  //   commit();
  // }
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
  addHighlighted(state, newMedia) {
    const findPosition = (arr, el) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].list.order > el.list.order) {
          return i;
        }
      }
      return arr.length;
    };
    const insert = (arr, item, index) => {
      if (index >= arr.length) {
        return [...arr, item];
      } else {
        return arr.reduce((s, a, i) => {
          i === index ? s.push(item, a) : s.push(a);
          return s;
        }, []);
      }
    };

    const position = findPosition(state.highlighted, newMedia);
    const newHighlighted = insert(state.highlighted, newMedia, position);
    state.highlighted = newHighlighted;
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
  },
  setVideoViewed(state, { mediaID, views }) {
    const mediaIndex = state.all.findIndex(media => media.mediaID === mediaID);
    if (
      state.all[mediaIndex] &&
      state.all[mediaIndex].statistics &&
      state.all[mediaIndex].statistics.total
    ) {
      Vue.set(state.all[mediaIndex].statistics.total, "views", views);
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
