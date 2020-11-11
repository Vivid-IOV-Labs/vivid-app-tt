import Api from "./ApiService.js";

export default {
  add(params, state) {
    return Api(state).post("flag/add/", params);
  }
};
