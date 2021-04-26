export default {
  getAll: state => state.all,
  getHighlighted: state => state.highlighted,
  getEarnHighlighted: state => state.earnhighlighted,
  getLatests: state => state.latests,
  getEarnLatests: state => state.earnlatests,
  getById: state => id => {
    return state.all.find(media => media.mediaID === id);
  }
};
