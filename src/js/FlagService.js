import Api from "@/js/api.js";

export default {
  add(params, state) {
    return Api(state).post("flag/add/", params);
  }
};
