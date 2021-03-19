import UserService from "@/services/UserService";
import devLog from "@/util/devlog.js";
const state = {
  user: null,
  walletAddress: null,
  interests: [],
  interestsSubmitted: false,
  termsAgreed: false
};

const getters = {
  getUser: state => state.user,
  getWallet: state => state.walletAddress,
  getInterestsSubmitted: state => state.interestsSubmitted,
  getTermsAgreed: state => state.termsAgreed
};

const actions = {
  async login({ commit }, userWalletAddress) {
    try {
      const { interestsSubmitted, termsAgreed } = await UserService.login(
        userWalletAddress
      );
      commit("setWallet", userWalletAddress);
      commit("setInterestsSubmitted", interestsSubmitted);
      commit("setTermsAgreed", termsAgreed);
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
      const userWalletAddress = getters.getWallet();
      await UserService.registerInterests({
        userWalletAddress,
        interests
      });
      commit("addUserInterests", interests);
    } catch (error) {
      devLog(error);
    }
  },
  async acceptTerms({ commit, getters }) {
    try {
      const userWalletAddress = getters.getWallet();
      await UserService.acceptTerms({
        userWalletAddress
      });
      commit("setTermsAgreed", true);
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
  setTermsAgreed(state, accepted) {
    state.termsAgreed = accepted;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
