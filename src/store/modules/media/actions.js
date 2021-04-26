import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";

export default {
  async populateAll({ commit }) {
    try {
      const all = await MediaService.getAll();

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
      const earnLatestsSortedByTime = all
        .filter(f => f.earn)
        .filter(f => !f.list || !f.list.highlighted)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      commit("setEarnLatests", earnLatestsSortedByTime);

      const earnHighlightedSortedByOrder = all
        .filter(f => f.earn)
        .filter(f => f.list && f.list.highlighted)
        .sort((a, b) => {
          return b.list.order - a.list.order;
        });
      commit("setEarnHighlighted", earnHighlightedSortedByOrder);
    } catch (error) {
      devLog(error);
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
