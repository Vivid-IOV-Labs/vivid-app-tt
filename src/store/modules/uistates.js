export default {
  namespaced: true,
  state: {
    isEarnPopOverVisited: false,
    isTTPopOverVisited: false
  },
  mutations: {
    setEarnPopOverVisited(state) {
      state.isEarnPopOverVisited = true;
    },
    serTTPopOverVisited(state) {
      state.isTTPopOverVisited = true;
    }
  }
};
