/* eslint-disable no-undef */
import env from "@/env";
import devLog from "@/util/devlog.js";

export const trackInit = () => {
  mixpanel.init(env.mixpanel_id, {
    api_host: "https://api-eu.mixpanel.com",
    batch_requests: true
  });
  ga("create", env.google_analytics_id, "auto");
  ga("send", "pageview");
};

export const trackUser = walletAddress => {
  mixpanel.identify(walletAddress);
  ga("send", "&uid", walletAddress);
  trackEvent({
    category: "Loading View",
    action: "login-user",
    label: walletAddress
  });
};

export const trackPage = path => {
  mixpanel.track(`Page view: ${path}`);
  ga("send", "pageview", path);
};

export const trackEvent = ({ category, action, label }) => {
  try {
    mixpanel.track(`${category}`, { action, label });
    ga("send", "event", category, action, label);
  } catch (error) {
    devLog(error);
  }
};
