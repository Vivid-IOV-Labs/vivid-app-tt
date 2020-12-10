import MediaService from "@/services/MediaService";
import devLog from "@/util/devLog";

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
      const { data } = await MediaService.getAll();
      commit("setAll", data);
    } catch (error) {
      devLog(error);
    }
  }
};

const mutations = {
  setAll(state, all) {
    state.all = all;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
