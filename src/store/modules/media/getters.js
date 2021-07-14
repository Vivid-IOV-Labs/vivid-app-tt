export default {
  getAll: state => state.all,
  getHighlighted: state => state.highlighted,
  getEarnCompleted: state => state.earncompleted,
  getLatests: state => state.latests,
  getEarnLatests: state => state.earnlatests,
  getCryptos: state => state.cryptos,
  getGamings: state => state.gamings,
  getOthers: state => state.others,
  getById: state => id => {
    return state.all.find(media => media.mediaID === id);
  }
};
