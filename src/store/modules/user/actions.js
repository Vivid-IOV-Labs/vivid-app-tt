import UserService from "@/services/UserService";
import devLog from "@/util/devlog.js";

export default {
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
    const userWalletAddress = getters.getWallet;

    try {
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
