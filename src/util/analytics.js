/* eslint-disable no-undef */
export const trackPage = path => {
  ga("send", "pageview", path);
  mixpanel.track(`Page view: ${path}`);
};

export const trackEvent = ({ category, action, label = null }) => {
  ga("send", "event", category, action, label);
  mixpanel.track(`${category} - ${action} - ${label}`);
};
