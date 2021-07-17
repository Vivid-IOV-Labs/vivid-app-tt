import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
// import delay from "@/util/delay.js";
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const contextApi = {
  latest: {
    currentPage: 0,
    totalItems: 0
  },
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
    const { commit, dispatch } = store;
    try {
      //run dispatch if exist for fixing unit test
      dispatch &&
        dispatch(
          "uistates/setTaskQueue",
          { name: "loadingMedia", loading: true },
          { root: true }
        );
      const latestsSortedByTimeParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("latest"),
        pageSize: 3,
        "list.highlighted": false
      };
      const { media: latestsSortedByTime } = await MediaService.getAll(
        latestsSortedByTimeParams
      );
      commit("setLatests", latestsSortedByTime);

      const highlightedSortedByOrderParams = {
        earn: false,
        sortBy: "list.order",
        order: "desc",
        page: nextPage("highlighted"),
        pageSize: 3,
        "list.highlighted": true
      };
      const { media: highlightedSortedByOrder } = await MediaService.getAll(
        highlightedSortedByOrderParams
      );
      commit("setHighlighteds", highlightedSortedByOrder);

      const cryptoParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("crypto"),
        pageSize: 3,
        categories: JSON.stringify(["crypto"])
      };
      const { media: cryptos } = await MediaService.getAll(cryptoParams);
      commit("setCryptos", cryptos);
      const gamingParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("gaming"),
        pageSize: 3,
        categories: JSON.stringify(["gaming"])
      };
      const { media: gamings } = await MediaService.getAll(gamingParams);
      commit("setGamings", gamings);
      const otherParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("other"),
        pageSize: 3,
        categories: JSON.stringify(["other"])
      };
      const { media: others } = await MediaService.getAll(otherParams);
      commit("setOthers", others);
    } catch (error) {
      devLog(error);
    } finally {
      dispatch &&
        dispatch(
          "uistates/setTaskQueue",
          { name: "loadingMedia", loading: false },
          { root: true }
        );
    }
  },
  async populateMoreHighlighteds({ commit }) {
    const gamingParams = {
      earn: false,
      sortBy: "createdAt",
      order: "desc",
      page: nextPage("highlighted"),
      pageSize: 3,
      "list.highlighted": true
    };
    const { media } = await MediaService.getAll(gamingParams);
    commit(`addHighlighteds`, media);
  },
  async populateMoreLatests({ commit }) {
    const gamingParams = {
      earn: false,
      sortBy: "createdAt",
      order: "desc",
      page: nextPage("latest"),
      pageSize: 3,
      "list.highlighted": false
    };
    const { media } = await MediaService.getAll(gamingParams);
    commit(`addLatests`, media);
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
    const { commit, dispatch } = store;
    try {
      const userWalletAddress = store.rootGetters["user/getWallet"];
      //run dispatch if exist for fixing unit test
      dispatch &&
        dispatch(
          "uistates/setTaskQueue",
          { name: "loadingMedia", loading: true },
          { root: true }
        );
      const earnParams = {
        earn: true,
        sortBy: "createdAt",
        order: "desc",
        page: nextPage("earn"),
        pageSize: 3,
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
    } finally {
      dispatch &&
        dispatch(
          "uistates/setTaskQueue",
          { name: "loadingMedia", loading: false },
          { root: true }
        );
    }
  },
  add({ commit }, newVideo) {
    commit("add", newVideo);
  },
  delete({ commit }, video) {
    commit("delete", video);
  }
};
