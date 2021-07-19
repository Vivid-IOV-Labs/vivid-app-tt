import axios from "axios";
import env from "@/env.js";
import store from "../store/index";
const apiService = axios.create({
  baseURL: env.web_service_url
});
const startLoading = () =>
  store.dispatch("uistates/setTaskQueue", {
    name: "globalLoader",
    loading: true
  });
const stopLoading = () =>
  store.dispatch("uistates/setTaskQueue", {
    name: "globalLoader",
    loading: false
  });
const isHandlerEnabled = (config = { handlerEnabled: true }) => {
  return config.handlerEnabled && !config.handlerEnabled ? false : true;
};

const errorHandler = error => {
  stopLoading();
  if (isHandlerEnabled(error.config)) {
    // Handle errors
  }
  return Promise.reject({ ...error });
};

const successHandler = response => {
  stopLoading();
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  const { data } = response;
  return data;
};

apiService.interceptors.request.use(
  config => {
    startLoading();
    return config;
  },
  error => {
    stopLoading();
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

export default apiService;
