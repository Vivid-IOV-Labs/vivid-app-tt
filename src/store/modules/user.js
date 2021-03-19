import UserService from "@/services/UserService";
import devLog from "@/util/devlog.js";
const state = {
  user: null,
  walletAddress: null,
  interests: [],
  interestsSubmitted: false,
  termsAccepted: false
};

const getters = {
  getUser: state => state.user,
  getWallet: state => state.walletAddress,
  getInterestsSubmitted: state => state.interestsSubmitted,
  getTermsAccepted: state => state.termsAccepted
};

const actions = {
  async login({ commit }, userWalletAddress) {
    try {
      const { interestsSubmitted, termsAccepted } = await UserService.login(
        userWalletAddress
      );
      commit("setWallet", userWalletAddress);
      commit("setInterestsSubmitted", interestsSubmitted);
      commit("setTermsAccepted", termsAccepted);
    } catch (error) {
      devLog(error);
    }
  },
  async setUser({ commit }, user) {
    await Promise.resolve(user);
    commit("setUser", user);
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
  },
  async acceptTerms({ commit }) {
    try {
      const userWalletAddress = getters.getWallet;
      await UserService.acceptTerms({
        userWalletAddress
      });
      commit("setTermsAccepted", true);
    } catch (error) {
      devLog(error);
    }
  }
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setWallet(state, wallet) {
    state.walletAddress = wallet;
  },
  addUserInterests(state, interests) {
    state.interests = [...state.interests, interests];
  },
  setInterestsSubmitted(state, interestsSubmitted) {
    state.interestsSubmitted = interestsSubmitted;
  },
  setTermsAccepted(state, accepted) {
    state.termsAccepted = accepted;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
