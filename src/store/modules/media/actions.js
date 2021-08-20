import MediaService from "@/services/MediaService";
import devLog from "@/util/devlog.js";
import capitalize from "@/util/capitalize.js";
import { startLoading, stopLoading } from "@/util/loader";

function resetPaginationParams() {
  return {
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
}

let paginationParams = resetPaginationParams();

function nextPage(category) {
  paginationParams[category].currentPage =
    paginationParams[category].currentPage + 1;
  return paginationParams[category].currentPage;
}

async function populateCategory(category, commit) {
  const { media, total } = await MediaService.populateCategory(category);
  commit(`set${capitalize(category)}s`, media);
  commit(`setTotal${capitalize(category)}s`, total);
}

function isHighlighted(media) {
  return media.list && media.list.highlighted;
}

function isEarnLatests(media) {
  return (
    media.earn && (!media.rewards || !media.rewards.rewardSmartContractTxHash)
  );
}

function isEarnCompleted(media) {
  return media.earn && media.rewards && media.rewards.rewardSmartContractTxHash;
}

function getCategories(media) {
  return media.mediaCategories.map(cat => `${cat.name}s`);
}

export default {
  async populateAll({ commit }) {
    paginationParams = resetPaginationParams();
    startLoading("populateAll");
    try {
      const {
        media: highlightedSortedByOrder,
        total: totalHighlighted
      } = await MediaService.populateHighlighteds();
      commit("setHighlighteds", highlightedSortedByOrder);
      commit("setTotalHighlighteds", totalHighlighted);

      await populateCategory("crypto", commit);
      await populateCategory("gaming", commit);
      await populateCategory("other", commit);
    } catch (error) {
      devLog(error);
    } finally {
      stopLoading("populateAll");
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
    const userWalletAddress = store.rootGetters["user/getWallet"];
    try {
      const {
        media: earnLatests,
        total: totalEarnLatests
      } = await MediaService.populateEarnLatests(userWalletAddress);
      commit("setEarnLatests", earnLatests);
      commit("setTotalEarnLatests", totalEarnLatests);
      const {
        media: earnCompleted,
        total: totalEarnCompleted
      } = await MediaService.populateEarnCompleted(userWalletAddress);
      commit("setEarnCompleted", earnCompleted);
      commit("setTotalEarnCompleted", totalEarnCompleted);
    } catch (error) {
      devLog(error);
    } finally {
      stopLoading("populateAll");
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
    const removeFrom = getCategories(item);
    if (isHighlighted(item)) {
      removeFrom.push("highlighteds");
    } else if (isEarnCompleted(item)) {
      removeFrom.push("earnLatests");
    } else if (isEarnLatests(item)) {
      removeFrom.push("earnCompleted");
    }
    const { commit } = store;
    console.log("removeFrom", removeFrom);
    removeFrom.forEach(category => {
      console.log("category", category);

      commit(`delete${capitalize(category)}`, item);
      console.log(`delete${capitalize(category)}`);

      const total = store.rootGetters[`media/getTotal${capitalize(category)}`];
      const newTotal = total - 1;
      commit(`setTotal${capitalize(category)}`, newTotal);
      console.log(`delete${capitalize(category)}`);
    });
  }
};
