import MediaService from "@/services/MediaService";

const state = {
  all: []
};

const getters = {
  getAll: state => state.all
};

const actions = {
  async populateAll({ commit }) {
    try {
      const { data } = await MediaService.getAll();
      commit("setAll", data);
    } catch (error) {
      console.log(error);
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
