export default {
  getUser: state => state.user,
  getWallet: state => state.walletAddress,
  getInterestsSubmitted: state => state.interestsSubmitted,
  getTermsAgreed: state => state.termsAgreed,
  getTwitterLinked: state => state.user && state.user.twitterProfile.length > 0,
  getRewardsEarned: state =>
    state.user &&
    state.user.statistics &&
    state.user.statistics.total &&
    state.user.statistics.total.rewards,
  getTwitterProfile: state =>
    state.user &&
    state.user.twitterProfile.length > 0 &&
    state.user.twitterProfile[0].profile
};
