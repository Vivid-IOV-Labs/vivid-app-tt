import axios from "axios";
import env from "@/env.js";

const apiService = axios.create({
  baseURL: env.web_service_url
});

const isHandlerEnabled = (config = { handlerEnabled: true }) => {
  return config.handlerEnabled && !config.handlerEnabled ? false : true;
};

const errorHandler = error => {
  if (isHandlerEnabled(error.config)) {
    // Handle errors
  }
  return Promise.reject({ ...error });
};

const successHandler = response => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response;
};

apiService.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

export default apiService;
