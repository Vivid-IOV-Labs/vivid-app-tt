import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
// import delay from "@/util/delay.js";

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
      // const latestsSortedByTime = all
      //   .filter(f => !f.earn)
      //   .filter(f => !f.list || !f.list.highlighted)
      //   .sort((a, b) => {
      //     return b.createdAt - a.createdAt;
      // });
      const latestsSortedByTimeParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 3
      };
      const latestsSortedByTime = await MediaService.getAll(
        latestsSortedByTimeParams
      );
      commit("setLatests", latestsSortedByTime);

      // const highlightedSortedByOrder = all
      //   .filter(f => !f.earn)
      //   .filter(f => f.list && f.list.highlighted)
      //   .sort((a, b) => {
      //     return b.list.order - a.list.order;
      //   });
      const highlightedSortedByOrderParams = {
        earn: false,
        sortBy: "list.order",
        order: "desc",
        page: 1,
        pageSize: 3,
        "list.highlighted": true
      };
      const highlightedSortedByOrder = await MediaService.getAll(
        highlightedSortedByOrderParams
      );
      commit("setHighlighted", highlightedSortedByOrder);
      const cryptoParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 3,
        categories: "['crypto']"
      };
      const cryptos = await MediaService.getAll(cryptoParams);
      commit("setCryptos", cryptos);
      const gamingParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 3,
        categories: "['gaming']"
      };
      const gamings = await MediaService.getAll(gamingParams);
      commit("setGamings", gamings);
      const otherParams = {
        earn: false,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 3,
        categories: "['other']"
      };
      const others = await MediaService.getAll(otherParams);
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
        page: 1,
        pageSize: 3,
        userWalletAddress
      };
      const earn = await MediaService.getAll(earnParams);
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
