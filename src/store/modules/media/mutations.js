import Vue from "vue";

export default {
  setAll(state, all) {
    state.all = all;
  },
  setLatests(state, latests) {
    state.latests = latests;
  },
  setHighlighted(state, highlighted) {
    state.highlighted = highlighted;
  },
  add(state, item) {
    state.all = [item, ...state.all];
  },
  addLatest(state, item) {
    state.latests = [item, ...state.latests];
  },
  addHighlighted(state, newMedia) {
    const findPosition = (arr, el) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].list.order > el.list.order) {
          return i;
        }
      }
      return arr.length;
    };
    const insert = (arr, item, index) => {
      if (index >= arr.length) {
        return [...arr, item];
      } else {
        return arr.reduce((s, a, i) => {
          i === index ? s.push(item, a) : s.push(a);
          return s;
        }, []);
      }
    };

    const position = findPosition(state.highlighted, newMedia);
    const newHighlighted = insert(state.highlighted, newMedia, position);
    state.highlighted = newHighlighted;
  },
  delete(state, { code }) {
    state.all = state.all.filter(media => media.code !== code);
  },
  deleteLatest(state, { code }) {
    state.latests = state.latests.filter(media => media.code !== code);
  },
  deleteHighlighted(state, { code }) {
    state.highlighted = state.highlighted.filter(media => media.code !== code);
  },
  setTotalTip(state, { mediaID, totalTips }) {
    const mediaIndex = state.all.findIndex(media => media.mediaID === mediaID);
    if (
      state.all[mediaIndex] &&
      state.all[mediaIndex].statistics &&
      state.all[mediaIndex].statistics.total
    ) {
      Vue.set(state.all[mediaIndex].statistics.total, "tips", totalTips);
    }
  },
  setVideoViewed(state, { mediaID, views }) {
    const mediaIndex = state.all.findIndex(media => media.mediaID === mediaID);
    if (
      state.all[mediaIndex] &&
      state.all[mediaIndex].statistics &&
      state.all[mediaIndex].statistics.total
    ) {
      Vue.set(state.all[mediaIndex].statistics.total, "views", views);
    }
  }
};