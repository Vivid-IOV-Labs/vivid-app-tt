import axios from "axios";
import env from "@/env.js";
// import { startLoading, stopLoading } from "../util/loader";
const apiService = axios.create({
  baseURL: env.web_service_url
});
const isHandlerEnabled = (config = { handlerEnabled: true }) => {
  return config.handlerEnabled && !config.handlerEnabled ? false : true;
};

const errorHandler = error => {
  // stopLoading("globalLoader");
  if (isHandlerEnabled(error.config)) {
    // Handle errors
  }
  return Promise.reject({ ...error });
};

const successHandler = response => {
  // stopLoading("globalLoader");
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  const { data } = response;
  return data;
};

apiService.interceptors.request.use(
  config => {
    // startLoading("globalLoader");
    return config;
  },
  error => {
    // stopLoading("globalLoader");
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

export default apiService;
