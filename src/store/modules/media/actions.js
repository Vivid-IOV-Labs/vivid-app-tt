import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
// import delay from "@/util/delay.js";

export default {
  async populateAll(store) {
    const { commit, dispatch } = store;
    try {
      const userWalletAddress = store.rootGetters["user/getWallet"];
      dispatch(
        "uistates/setTaskQueue",
        { name: "loadingMedia", loading: true },
        { root: true }
      );
      const all = await MediaService.getAll(userWalletAddress);
      // await delay(4000);

      commit("setAll", all);

      const latestsSortedByTime = all
        .filter(f => !f.earn)
        .filter(f => !f.list || !f.list.highlighted)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      commit("setLatests", latestsSortedByTime);

      const highlightedSortedByOrder = all
        .filter(f => !f.earn)
        .filter(f => f.list && f.list.highlighted)
        .sort((a, b) => {
          return b.list.order - a.list.order;
        });
      commit("setHighlighted", highlightedSortedByOrder);

      /**Earn */
      const earn = all.filter(f => f.earn);
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
      dispatch(
        "uistates/setTaskQueue",
        { name: "loadingMedia", loading: false },
        { root: true }
      );
    }
  },
  add({ commit }, newVideo) {
    if (newVideo.list && newVideo.list.highlighted) {
      commit("addHighlighted", newVideo);
    } else {
      commit("addLatest", newVideo);
    }
    commit("add", newVideo);
  },
  delete({ commit }, video) {
    commit("deleteHighlighted", video);
    commit("deleteLatest", video);
    commit("delete", video);
  }
  // async videoViewed({ commit }, { mediaID, userWalletAddress }) {
  //   const views = await MediaService.videoViewed({ mediaID, userWalletAddress });
  //   console.log(views);
  //   commit();
  // }
};
