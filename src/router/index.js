import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
Vue.use(VueRouter);

const RootLoading = () =>
  import(/* webpackChunkName: "RootLoading" */ "@/pages/RootLoading");
// const RootLogin = () =>
//   import(/* webpackChunkName: "RootLogin" */ "@/pages/RootLogin");
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
// const Home = () => import(/* webpackChunkName: "Home" */ "@/pages/Home");
// const OnBoarding = () =>
//   import(/* webpackChunkName: "OnBoarding" */ "@/pages/OnBoarding");
// const ViewStream = () =>
//   import(/* webpackChunkName: "ViewStream" */ "@/pages/ViewStream");

// const SupplyStream = () =>
//   import(/* webpackChunkName: "SupplyStream" */ "@/pages/SupplyStream");

const routes = [
  { path: "*", component: Profile },

  { name: "root", path: "/", component: RootLoading },
  // { name: "root", path: "/", component: RootLogin },
  { name: "videolist", path: "/videolist", component: VideoList },
  { name: "viewvideo", path: "/viewvideo/:mediaID", component: ViewVideo },
  { name: "earnvideolist", path: "/earnvideolist", component: EarnVideoList },
  {
    name: "earnviewvideo",
    path: "/earnviewvideo/:mediaID",
    component: EarnViewVideo
  },
  { name: "profile", path: "/profile", component: Profile }
  // { name: "onboarding", path: "/onboarding", component: OnBoarding },
  // { name: "home", path: "/home", component: Home },
  // { name: "viewstream", path: "/viewstream", component: ViewStream },
  // { name: "supplystream", path: "/supplystream", component: SupplyStream }
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes
});

router.beforeEach(async (to, from, next) => {
  if (store.getters["smartcontract/getUserWalletAddress"]) {
    next();
  } else {
    await store.dispatch("smartcontract/createSmartContractFactory");
    if (store.getters["smartcontract/getUserWalletAddress"]) {
      await store.dispatch(
        "user/login",
        store.getters["smartcontract/getUserWalletAddress"]
      );
      next();
    } else {
      next(false);
    }
  }
});

export default router;
