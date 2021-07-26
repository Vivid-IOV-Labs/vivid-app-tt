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
  addEarnlatests(state, earnlatest) {
    state.earnlatests = [...state.earnlatests, ...earnlatest];
  },
  addEarncompleted(state, completed) {
    state.earncompleted = [...state.earncompleted, ...completed];
  },
  deleteHighlighteds(state, item) {
    state.highlighteds = state.highlighteds.filter(
      media => media.mediaID !== item.mediaID
    );
  },
  deleteCryptos(state, item) {
    state.cryptos = state.cryptos.filter(
      media => media.mediaID !== item.mediaID
    );
  },
  deleteOthers(state, item) {
    state.others = state.others.filter(media => media.mediaID !== item.mediaID);
  },
  deleteGamings(state, item) {
    state.gamings = state.gamings.filter(
      media => media.mediaID !== item.mediaID
    );
  },
  deleteEarnlatests(state, item) {
    state.earnlatests = state.earnlatests.filter(
      media => media.mediaID !== item.mediaID
    );
  },
  deleteEarncompleted(state, item) {
    state.earncompleted = state.earncompleted.filter(
      media => media.mediaID !== item.mediaID
    );
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
  // add(state, item) {
  //   // if (item.list && item.list.highlighted) {
  //   //   console.log("add highlighted");
  //   //   state.highlighted = [item, ...state.highlighted];
  //   // }
  //   // if (item.categories) {
  //   //   if (item.categories.includes("crypto")) {
  //   //     console.log("add highlighted");
  //   //     state.cryptos = [item, ...state.cryptos];
  //   //   }
  //   //   if (item.categories.includes("gaming")) {
  //   //     state.gamings = [item, ...state.gamings];
  //   //   }
  //   //   if (item.categories.includes("other")) {
  //   //     state.others = [item, ...state.others];
  //   //   }
  //   // }
  // },
  // delete(state, item) {
  //   [
  //     "earncompleted",
  //     "highlighteds",
  //     "earnlatests",
  //     "cryptos",
  //     "gamings",
  //     "others"
  //   ].forEach(key => {
  //     const index = state[key].findIndex(
  //       media => media.mediaID == item.mediaID
  //     );
  //     if (index > -1) {
  //       state[key] = state[key].filter(media => media.mediaID == item.mediaID);
  //     }
  //   });
  //   //const { mediaID } = item;
  //   // if (item.list && item.list.highlighted) {
  //   //   state.highlighted = state.highlighted.filter(
  //   //     media => media.mediaID !== mediaID
  //   //   );
  //   // }
  //   // if (item.categories) {
  //   //   if (item.categories.includes("crypto")) {
  //   //     state.cryptos = state.cryptos.filter(
  //   //       media => media.mediaID !== mediaID
  //   //     );
  //   //   }
  //   //   if (item.categories.includes("gaming")) {
  //   //     state.gamings = state.gamings.filter(
  //   //       media => media.mediaID !== mediaID
  //   //     );
  //   //   }
  //   //   if (item.categories.includes("other")) {
  //   //     state.others = state.others.filter(media => media.mediaID !== mediaID);
  //   //   }
  //   // }
  // },
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
