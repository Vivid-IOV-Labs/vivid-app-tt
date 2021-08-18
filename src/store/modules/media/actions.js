import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
import capitalize from "@/util/capitalize.js";
// function resetPaginationParams() {
//   return {
//     highlighted: {
//       currentPage: 1,
//       totalItems: 0
//     },
//     gaming: {
//       currentPage: 1,
//       totalItems: 0
//     },
//     crypto: {
//       currentPage: 1,
//       totalItems: 0
//     },
//     other: {
//       currentPage: 1,
//       totalItems: 0
//     },
//     earn: {
//       currentPage: 1,
//       totalItems: 0
//     }
//   };
// }
const contextApi = {
  highlighted: {
    currentPage: 1,
    totalItems: 0
  },
  gaming: {
    currentPage: 1,
    totalItems: 0
  },
  crypto: {
    currentPage: 1,
    totalItems: 0
  },
  other: {
    currentPage: 1,
    totalItems: 0
  },
  earn: {
    currentPage: 1,
    totalItems: 0
  }
};
function nextPage(category) {
  contextApi[category].currentPage = contextApi[category].currentPage + 1;
  return contextApi[category].currentPage;
}
async function populateHighlighteds() {
  const params = {
    earn: false,
    sortBy: "list.order",
    order: "desc",
    page: 1,
    pageSize: 3,
    "list.highlighted": true
  };
  return await MediaService.getAll(params);
}
async function populateCategory(category) {
  const params = {
    earn: false,
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    pageSize: 3,
    categories: JSON.stringify([category])
  };
  return await MediaService.getAll(params);
}
export default {
  async populateAll({ commit }) {
    try {
      const {
        media: highlightedSortedByOrder,
        total: totalHighlighted
      } = await populateHighlighteds();
      commit("setHighlighteds", highlightedSortedByOrder);
      commit("setTotalHighlighteds", totalHighlighted);

      const { media: cryptos, total: totalCryptos } = await populateCategory(
        "crypto"
      );
      commit("setCryptos", cryptos);
      commit("setTotalCryptos", totalCryptos);

      const { media: gamings, total: totalGamings } = await populateCategory(
        "gaming"
      );
      commit("setGamings", gamings);
      commit("setTotalGamings", totalGamings);
      const { media: others, total: totalOthers } = await populateCategory(
        "other"
      );
      commit("setOthers", others);
      commit("setTotalOthers", totalOthers);
    } catch (error) {
      devLog(error);
    }
  },
  async populateMoreHighlighteds({ commit }) {
    const params = {
      earn: false,
      sortBy: "list.order",
      order: "desc",
      page: nextPage("highlighted"),
      pageSize: 3,
      "list.highlighted": true
    };
    const { media } = await MediaService.getAll(params);
    commit(`addHighlighteds`, media);
  },
  async populateMore({ commit }, category) {
    const params = {
      earn: false,
      sortBy: "createdAt",
      order: "desc",
      page: nextPage(`${category}`),
      pageSize: 3,
      categories: JSON.stringify([category])
    };
    const { media } = await MediaService.getAll(params);
    commit(`add${capitalize(category)}s`, media);
  },
  async populateEarn(store) {
    const { commit } = store;
    try {
      const userWalletAddress = store.rootGetters["user/getWallet"];
      /*TODO vertial scrolling pagination*/
      const earnParams = {
        earn: true,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 10,
        userWalletAddress
      };
      const { media: earn } = await MediaService.getAll(earnParams);
      const earnLatestsSortedByTime = earn
        .filter(f => !f.rewards || !f.rewards.rewardSmartContractTxHash)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      commit("setEarnLatests", earnLatestsSortedByTime);

      const earnHighlightedSortedByOrder = earn
        .filter(f => f.rewards && f.rewards.rewardSmartContractTxHash)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      commit("setEarnCompleted", earnHighlightedSortedByOrder);
    } catch (error) {
      devLog(error);
    }
  },
  async populateCurrentMedia({ commit }, params) {
    const media = await MediaService.find(params);
    commit("setCurrentMedia", media);
  },
  add({ commit }, newVideo) {
    commit("add", newVideo);
  },
  delete(store, item) {
    const { commit, state } = store;

    [
      "earncompleted",
      "highlighteds",
      "earnlatests",
      "cryptos",
      "gamings",
      "others"
    ].forEach(category => {
      const index = state[category].findIndex(
        media => media.mediaID == item.mediaID
      );
      if (index > -1) {
        commit(`delete${capitalize(category)}`, item);
        const total =
          store.rootGetters[`media/getTotal${capitalize(category)}`];
        const newTotal = total - 1;
        commit(`setTotal${capitalize(category)}`, newTotal);
      }
    });
  }
};
