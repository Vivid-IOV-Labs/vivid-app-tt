import UserService from "@/services/UserService";
import devLog from "@/util/devlog.js";
const state = {
  walletAddress: null,
  interests: [],
  interestsSubmitted: false
};

const getters = {
  getWallet: state => state.walletAddress,
  getInterestsSubmitted: state => state.interestsSubmitted
};

const actions = {
  async login({ commit }, userWalletAddress) {
    try {
      const { interestsSubmitted } = await UserService.login(userWalletAddress);
      commit("setWallet", userWalletAddress);
      commit("setInterestsSubmitted", interestsSubmitted);
    } catch (error) {
      devLog(error);
    }
  },
  async addUserInterests({ commit, getters }, interests) {
    try {
      const userWalletAddress = getters.getWallet;
      await UserService.registerInterests({
        userWalletAddress,
        interests
      });
      commit("addUserInterests", interests);
    } catch (error) {
      devLog(error);
    }
  }
};

const mutations = {
  setWallet(state, wallet) {
    state.walletAddress = wallet;
  },
  addUserInterests(state, interests) {
    state.interests = [...state.interests, interests];
  },
  setInterestsSubmitted(state, interestsSubmitted) {
    state.interestsSubmitted = interestsSubmitted;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
