export default {
  getAll: state => state.all,
  getHighlighted: state => state.highlighted,
  getLatests: state => state.latests,
  getById: state => id => {
    return state.all.find(media => media.mediaID === id);
  }
};
