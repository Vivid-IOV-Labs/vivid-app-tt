import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const RootLoading = () =>
  import(/* webpackChunkName: "RootLoading" */ "@/pages/RootLoading");
const Home = () => import(/* webpackChunkName: "Home" */ "@/pages/Home");
const OnBoarding = () =>
  import(/* webpackChunkName: "OnBoarding" */ "@/pages/OnBoarding");
const ViewStream = () =>
  import(/* webpackChunkName: "ViewStream" */ "@/pages/ViewStream");
const ViewVideo = () =>
  import(/* webpackChunkName: "ViewVideo" */ "@/pages/ViewVideo");
const VideoList = () =>
  import(/* webpackChunkName: "VideoList" */ "@/pages/VideoList");
const SupplyStream = () =>
  import(/* webpackChunkName: "SupplyStream" */ "@/pages/SupplyStream");

const routes = [
  { name: "root", path: "/", component: RootLoading },
  { name: "videolist", path: "/videolist", component: VideoList },
  { name: "viewvideo", path: "/viewvideo", component: ViewVideo },
  { name: "onboarding", path: "/onboarding", component: OnBoarding },
  { name: "home", path: "/home", component: Home },
  { name: "viewstream", path: "/viewstream", component: ViewStream },
  { name: "supplystream", path: "/supplystream", component: SupplyStream }
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes
});

export default router;
