import UserService from "@/services/UserService";
import devLog from "@/util/devlog.js";
import TwitterAuthService from "@/services/TwitterAuthService";

export default {
  async login({ commit }, userWalletAddress) {
    try {
      const { interestsSubmitted, termsAgreed } = await UserService.login(
        userWalletAddress
      );
      commit("setWallet", userWalletAddress);
      commit("setInterestsSubmitted", interestsSubmitted);
      commit("setTermsAgreed", termsAgreed);
      const user = await UserService.profile(userWalletAddress);
      commit("setUser", user);
    } catch (error) {
      devLog(error);
    }
  },
  async disconnectTwitter({ commit }, userWalletAddress) {
    const { user } = await TwitterAuthService.disconnect(userWalletAddress);
    commit("setUser", user);
  },
  async setUser({ commit }, user) {
    await Promise.resolve(user);
    commit("setUser", user);
  },
  async addUserInterests({ commit, getters }, interests) {
    const userWalletAddress = getters.getWallet;

    try {
      await UserService.registerInterests({
        userWalletAddress,
        interests
      });
      commit("addUserInterests", interests);
      commit("setInterestsSubmitted", true);
    } catch (error) {
      devLog(error);
    }
  },
  async acceptTerms({ commit, getters }) {
    const userWalletAddress = getters.getWallet;

    try {
      await UserService.acceptTerms({
        userWalletAddress
      });
      commit("setTermsAgreed", true);
    } catch (error) {
      devLog(error);
    }
  }
};
