export default {
  getAll: state => state.all,
  getHighlighteds: state => state.highlighteds,
  getTotalHighlighteds: state => state.totalHighlighteds,
  getEarnCompleted: state => state.earncompleted,
  getLatests: state => state.latests,
  getTotalLatests: state => state.totalLatests,
  getEarnLatests: state => state.earnlatests,
  getCryptos: state => state.cryptos,
  getTotalCryptos: state => state.totalCryptos,
  getGamings: state => state.gamings,
  getTotalGamings: state => state.totalGamings,
  getOthers: state => state.others,
  getTotalOthers: state => state.totalOthers,
  getById: state => id => {
    return state.all.find(media => media.mediaID === id);
  }
};
