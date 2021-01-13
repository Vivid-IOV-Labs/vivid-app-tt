// Init Analytics

function isMobile() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  } else {
    return false;
  }
}
if (!isMobile()) {
  document.body.classList.add("constrain-width");
}
if (!(window.avatar || window.hubId) && process.env.NODE_ENV === "production") {
  window.location.replace("https://www.vividiov.com/peerkat");
}

import { trackInit } from "@/util/analytics";
trackInit();

import "onsenui/css/onsenui-core.min.css";
import "onsenui/css/onsen-css-components.min.css";

import Vue from "vue";

import VueOnsen from "vue-onsenui/esm";
import VOnsToolbar from "vue-onsenui/esm/components/VOnsToolbar";
import VOnsBottomToolbar from "vue-onsenui/esm/components/VOnsBottomToolbar";
import VOnsToolbarButton from "vue-onsenui/esm/components/VOnsToolbarButton";
import VOnsButton from "vue-onsenui/esm/components/VOnsButton";
import VOnsBackButton from "vue-onsenui/esm/components/VOnsBackButton";
// import VOnsInput from "vue-onsenui/esm/components/VOnsInput";
// import VOnsSearchInput from "vue-onsenui/esm/components/VOnsSearchInput";
import VOnsNavigator from "vue-onsenui/esm/components/VOnsNavigator";

import VOnsPage from "vue-onsenui/esm/components/VOnsPage";
// import VOnsCarousel from "vue-onsenui/esm/components/VOnsCarousel";
// import VOnsCarouselItem from "vue-onsenui/esm/components/VOnsCarouselItem";
import VOnsList from "vue-onsenui/esm/components/VOnsList";
import VOnsListItem from "vue-onsenui/esm/components/VOnsListItem";
import VOnsPopover from "vue-onsenui/esm/components/VOnsPopover";
import VOnsToast from "vue-onsenui/esm/components/VOnsToast";
import VOnsDialog from "vue-onsenui/esm/components/VOnsDialog";
import VOnsAlertDialog from "vue-onsenui/esm/components/VOnsAlertDialog";
import VOnsAlertDialogButton from "vue-onsenui/esm/components/VOnsAlertDialogButton";

Vue.use(VueOnsen);
Vue.component(VOnsPage.name, VOnsPage);
Vue.component(VOnsToolbar.name, VOnsToolbar);
Vue.component(VOnsBottomToolbar.name, VOnsBottomToolbar);
Vue.component(VOnsToolbarButton.name, VOnsToolbarButton);
Vue.component(VOnsButton.name, VOnsButton);
Vue.component(VOnsBackButton.name, VOnsBackButton);
// Vue.component(VOnsInput.name, VOnsInput);
// Vue.component(VOnsSearchInput.name, VOnsSearchInput);
Vue.component(VOnsNavigator.name, VOnsNavigator);
// Vue.component(VOnsCarousel.name, VOnsCarousel);
// Vue.component(VOnsCarouselItem.name, VOnsCarouselItem);
Vue.component(VOnsList.name, VOnsList);
Vue.component(VOnsListItem.name, VOnsListItem);
Vue.component(VOnsPopover.name, VOnsPopover);
Vue.component(VOnsToast.name, VOnsToast);
Vue.component(VOnsDialog.name, VOnsDialog);
Vue.component(VOnsAlertDialog.name, VOnsAlertDialog);
Vue.component(VOnsAlertDialogButton.name, VOnsAlertDialogButton);

import BaseIcon from "@/components/BaseIcon";
Vue.component("BaseIcon", BaseIcon);
//THIS IS TO IMPORT THE 'VUEX' STORE TO BE USED IN THE VUE APP.
import store from "./store";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
