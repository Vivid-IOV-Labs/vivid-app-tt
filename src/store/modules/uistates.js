import delay from "@/util/delay.js";

export default {
  namespaced: true,
  state: {
    isEarnPopOverVisited: false,
    isTTPopOverVisited: false,
    taskQueue: []
  },
  getters: {
    isLoading: state => state.taskQueue.some(task => task.loading)
  },
  actions: {
    async setTaskQueue({ commit }, { name, loading }) {
      if (loading) {
        //console.log(state.taskQueue.findIndex(t => t.name == name));
        commit("setTaskQueue", { name, loading });
      } else {
        await delay(1000);
        commit("setTaskQueue", { name, loading });
      }
    }
  },
  mutations: {
    setEarnPopOverVisited(state) {
      state.isEarnPopOverVisited = true;
    },
    serTTPopOverVisited(state) {
      state.isTTPopOverVisited = true;
    },
    setIsLoading(state, value) {
      state.isLoading = value;
    },
    setTaskQueue(state, task) {
      if (task.loading) {
        state.taskQueue = [...state.taskQueue, task];
      } else {
        state.taskQueue = state.taskQueue.filter(t => t.name != task.name);
      }
    }
  }
};
