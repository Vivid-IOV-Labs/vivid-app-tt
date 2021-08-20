export default {
  getAll: state => state.all,

  getEarnCompleted: state => state.earnCompleted,
  getTotalEarnCompleted: state => state.totalEarnCompleted,
  getEarnLatests: state => state.earnLatests,
  getTotalEarnLatests: state => state.totalEarnLatests,
  getLatests: state => state.latests,
  getTotalLatests: state => state.totalLatests,

  getHighlighteds: state => state.highlighteds,
  getTotalHighlighteds: state => state.totalHighlighteds,

  getCryptos: state => state.cryptos,
  getTotalCryptos: state => state.totalCryptos,
  getGamings: state => state.gamings,
  getTotalGamings: state => state.totalGamings,
  getOthers: state => state.others,
  getTotalOthers: state => state.totalOthers,
  getCurrentMedia: state => state.currentMedia
};
