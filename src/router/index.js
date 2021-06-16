import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
Vue.use(VueRouter);

const Profile = () =>
  import(/* webpackChunkName: "Profile" */ "@/pages/Profile");
const ViewVideo = () =>
  import(/* webpackChunkName: "ViewVideo" */ "@/pages/ViewVideo");
const VideoList = () =>
  import(/* webpackChunkName: "VideoList" */ "@/pages/VideoList");
const EarnViewVideo = () =>
  import(/* webpackChunkName: "EarnViewVideo" */ "@/pages/EarnViewVideo");
const EarnVideoList = () =>
  import(/* webpackChunkName: "EarnVideoList" */ "@/pages/EarnVideoList");

const routes = [
  { path: "*", component: VideoList },
  { name: "home", path: "/", component: VideoList },
  { name: "videolist", path: "/videolist", component: VideoList },
  { name: "viewvideo", path: "/viewvideo/:mediaID", component: ViewVideo },
  { name: "earnvideolist", path: "/earnvideolist", component: EarnVideoList },
  {
    name: "earnviewvideo",
    path: "/earnviewvideo/:mediaID",
    component: EarnViewVideo
  },
  { name: "profile", path: "/profile/", component: Profile },
  { name: "profilestatus", path: "/profile/:status", component: Profile }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach(async (to, from, next) => {
  if (store.getters["smartcontract/getUserWalletAddress"]) {
    next();
    return;
  } else {
    await store.dispatch("smartcontract/createSmartContractFactory");
    if (store.getters["smartcontract/getUserWalletAddress"]) {
      await store.dispatch(
        "user/login",
        store.getters["smartcontract/getUserWalletAddress"]
      );
      next();
      return;
    } else {
      next(false);
      return;
    }
  }
});

export default router;
