import Vue from "vue";

export default {
  setAll(state, all) {
    state.all = all;
  },
  setHighlighteds(state, highlighted) {
    state.highlighteds = highlighted;
  },
  setTotalHighlighteds(state, total) {
    state.totalHighlighteds = total;
  },
  setCryptos(state, cryptos) {
    state.cryptos = cryptos;
  },
  setTotalCryptos(state, total) {
    state.totalCryptos = total;
  },
  setGamings(state, gamings) {
    state.gamings = gamings;
  },
  setTotalGamings(state, total) {
    state.totalGamings = total;
  },
  setOthers(state, others) {
    state.others = others;
  },
  setTotalOthers(state, total) {
    state.totalOthers = total;
  },
  addHighlighteds(state, highlighted) {
    state.highlighteds = [...state.highlighteds, ...highlighted];
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
  setCurrentMedia(state, currentMedia) {
    state.currentMedia = currentMedia;
  },
  add(state, item) {
    if (item.list && item.list.highlighted) {
      state.highlighted = [item, ...state.highlighted];
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
  setTotalTip(state, { totalTips }) {
    if (
      state.currentMedia &&
      state.currentMedia.statistics &&
      state.currentMedia.statistics.total
    ) {
      Vue.set(state.currentMedia.statistics.total, "tips", totalTips);
    }
  }
};
