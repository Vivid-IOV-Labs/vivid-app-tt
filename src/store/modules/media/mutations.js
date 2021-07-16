import Vue from "vue";

export default {
  setAll(state, all) {
    state.all = all;
  },
  setLatests(state, latests) {
    state.latests = latests;
  },
  setHighlighteds(state, highlighted) {
    state.highlighted = highlighted;
  },
  setCryptos(state, cryptos) {
    state.cryptos = cryptos;
  },
  setGamings(state, gamings) {
    state.gamings = gamings;
  },
  setOthers(state, others) {
    state.others = [...state.others, ...others];
  },
  addLatests(state, latests) {
    state.latests = [...state.latests, ...latests];
  },
  addHighlighteds(state, highlighted) {
    state.highlighted = [...state.highlighted, ...highlighted];
  },
  addCryptos(state, cryptos) {
    state.cryptos = [...state.cryptos, ...cryptos];
  },
  addGamings(state, gamings) {
    state.gamings = [...state.gamings, ...gamings];
  },
  addOthers(state, others) {
    state.others = [...state.others, ...others];
  },
  setEarnLatests(state, latests) {
    state.earnlatests = latests;
  },
  setEarnCompleted(state, completed) {
    state.earncompleted = completed;
  },
  add(state, item) {
    if (item.list && item.list.highlighted) {
      state.highlighted = [item, ...state.highlighted];
    } else {
      state.latests = [item, ...state.latests];
    }
    if (item.categories) {
      if (item.categories.includes("crypto")) {
        state.cryptos = [item, ...state.cryptos];
      }
      if (item.categories.includes("gaming")) {
        state.gamings = [item, ...state.gamings];
      }
      if (item.categories.includes("other")) {
        state.others = [item, ...state.others];
      }
    }
  },
  delete(state, item) {
    const { mediaID } = item;
    if (item.list && item.list.highlighted) {
      state.highlighted = state.highlighted.filter(
        media => media.mediaID !== mediaID
      );
    } else {
      state.latests = state.latests.filter(media => media.mediaID !== mediaID);
    }
    if (item.categories) {
      if (item.categories.includes("crypto")) {
        state.cryptos = state.cryptos.filter(
          media => media.mediaID !== mediaID
        );
      }
      if (item.categories.includes("gaming")) {
        state.gamings = state.gamings.filter(
          media => media.mediaID !== mediaID
        );
      }
      if (item.categories.includes("other")) {
        state.others = state.others.filter(media => media.mediaID !== mediaID);
      }
    }
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
