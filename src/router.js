import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const RootLoading = () =>
  import(/* webpackChunkName: "RootLoading" */ "@/components/RootLoading");
const Home = () => import(/* webpackChunkName: "Home" */ "@/components/Home");
const OnBoarding = () =>
  import(/* webpackChunkName: "OnBoarding" */ "@/components/OnBoarding");
const ViewStream = () =>
  import(/* webpackChunkName: "ViewStream" */ "@/components/ViewStream");
const SupplyStream = () =>
  import(/* webpackChunkName: "SupplyStream" */ "@/components/SupplyStream");

const routes = [
  { name: "root", path: "/", component: RootLoading },
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
