import Api from "@/js/api.js";

export default {
  find_all_requests(params, state) {
    return Api(state).post("request/find/addresses/", params);
  },
  add(params, state) {
    return Api(state).post("request/add/", params);
  },
  get_requests(state) {
    return Api(state).get("request/find/all/");
  },
  create(params, state) {
    return Api(state).post("requests", params);
  },
  findWhere(params, state) {
    let code = params.openLocationCode;
    code = code.replace("+", "%2B");
    return Api(state).get(`requests?openLocationCode=${code}`);
  }
};
