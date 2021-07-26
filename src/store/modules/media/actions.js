import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
import capitalize from "@/util/capitalize.js";

const contextApi = {
  highlighted: {
    currentPage: 0,
    totalItems: 0
  },
  gaming: {
    currentPage: 0,
    totalItems: 0
  },
  crypto: {
    currentPage: 0,
    totalItems: 0
  },
  other: {
    currentPage: 0,
    totalItems: 0
  },
  earn: {
    currentPage: 0,
    totalItems: 0
  }
};
function nextPage(category) {
  contextApi[category].currentPage = contextApi[category].currentPage + 1;
  return contextApi[category].currentPage;
}
export default {
  async populateAll(store) {
    contextApi.highlighted.currentPage = 0;
    contextApi.gaming.currentPage = 0;
    contextApi.crypto.currentPage = 0;
    contextApi.other.currentPage = 0;

    const { commit } = store;
    try {
      const highlightedSortedByOrderParams = {
        earn: false,
        sortBy: "list.order",
        order: "desc",
        page: nextPage("highlighted"),
        pageSize: 3,
        "list.highlighted": true
      };
      const {
        media: highlightedSortedByOrder,
        total: totalHighlighted
      } = await MediaService.getAll(highlightedSortedByOrderParams);
      commit("setHighlighteds", highlightedSortedByOrder);
      commit("setTotalHighlighteds", totalHighlighted);

      const cryptoParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("crypto"),
        pageSize: 3,
        categories: JSON.stringify(["crypto"])
      };
      const { media: cryptos, total: totalCryptos } = await MediaService.getAll(
        cryptoParams
      );
      commit("setCryptos", cryptos);
      commit("setTotalCryptos", totalCryptos);
      const gamingParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("gaming"),
        pageSize: 3,
        categories: JSON.stringify(["gaming"])
      };
      const { media: gamings, total: totalGamings } = await MediaService.getAll(
        gamingParams
      );
      commit("setGamings", gamings);
      commit("setTotalGamings", totalGamings);
      const otherParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("other"),
        pageSize: 3,
        categories: JSON.stringify(["other"])
      };
      const { media: others, total: totalOthers } = await MediaService.getAll(
        otherParams
      );
      commit("setOthers", others);
      commit("setTotalOthers", totalOthers);
    } catch (error) {
      devLog(error);
    }
  },
  async populateMoreHighlighteds({ commit }) {
    const gamingParams = {
      earn: false,
      sortBy: "list.order",
      order: "desc",
      page: nextPage("highlighted"),
      pageSize: 3,
      "list.highlighted": true
    };
    const { media } = await MediaService.getAll(gamingParams);
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
    contextApi.earn.currentPage = 0;
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
