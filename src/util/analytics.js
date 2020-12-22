/* eslint-disable no-undef */
import env from "@/env";

export const trackInit = () => {
  mixpanel.init(env.mixpanel_id, {
    api_host: "https://api-eu.mixpanel.com",
    batch_requests: true
  });
  ga("create", env.google_analytics_id, "auto");
  ga("send", "pageview");
};

export const trackUser = walletAddress => {
  ga("send", "&uid", walletAddress);
  mixpanel.identify(walletAddress);
  trackEvent({
    category: "Loading View",
    action: "login-user",
    label: walletAddress
  });
};

export const trackPage = path => {
  ga("send", "pageview", path);
  mixpanel.track(`Page view: ${path}`);
};

export const trackEvent = ({ category, action, label = null }) => {
  ga("send", "event", category, action, label);
  mixpanel.track(`${category} - ${action} - ${label}`);
};
