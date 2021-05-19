export default {
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
  },
  setTwitterLinked(state, twitterLinked) {
    state.twitterLinked = twitterLinked;
  }
};
