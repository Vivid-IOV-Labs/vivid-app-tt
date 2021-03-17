import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const RootLoading = () =>
  import(/* webpackChunkName: "RootLoading" */ "@/pages/RootLoading");
// const RootLogin = () =>
//   import(/* webpackChunkName: "RootLogin" */ "@/pages/RootLogin");
// const Profile = () =>
//   import(/* webpackChunkName: "Profile" */ "@/pages/Profile");
const ViewVideo = () =>
  import(/* webpackChunkName: "ViewVideo" */ "@/pages/ViewVideo");
const VideoList = () =>
  import(/* webpackChunkName: "VideoList" */ "@/pages/VideoList");
// const Home = () => import(/* webpackChunkName: "Home" */ "@/pages/Home");
// const OnBoarding = () =>
//   import(/* webpackChunkName: "OnBoarding" */ "@/pages/OnBoarding");
// const ViewStream = () =>
//   import(/* webpackChunkName: "ViewStream" */ "@/pages/ViewStream");

// const SupplyStream = () =>
//   import(/* webpackChunkName: "SupplyStream" */ "@/pages/SupplyStream");

const routes = [
  { name: "root", path: "/", component: RootLoading },
  // { name: "root", path: "/", component: RootLogin },
  // { name: "profile", path: "/profile", component: Profile },
  { name: "videolist", path: "/videolist", component: VideoList },
  { name: "viewvideo", path: "/viewvideo/:mediaID", component: ViewVideo }
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

export default router;
