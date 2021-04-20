import mockEmitter from "../emitter";
import mockMedia from "../db/media";
import { mount, createLocalVue } from "@vue/test-utils";
import VideoList from "@/pages/VideoList.vue";
import VueLazyload from "vue-lazyload";
import Vuex from "vuex";
import mediaGetters from "../../src/store/modules/media/getters";
import mediaMutations from "../../src/store/modules/media/mutations";
import mediaActions from "../../src/store/modules/media/actions";
import userGetters from "../../src/store/modules/user/getters";

jest.mock("@/util/webSocketService.js", () => {
  const socket = mockEmitter;
  const webSocketService = {
    socket
  };
  return webSocketService;
});
jest.mock("@/services/MediaService.js", () => {
  return { getAll: jest.fn().mockResolvedValue(mockMedia) };
});
jest.mock("@/util/analytics.js", () => {
  return { trackEvent: jest.fn() };
});
const mediaState = () => ({
  all: [],
  latests: [],
  highlighted: []
});

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueLazyload);
const store = new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      getters: userGetters
    },
    media: {
      namespaced: true,
      state: mediaState(),
      getters: mediaGetters,
      mutations: mediaMutations,
      actions: mediaActions
    }
  }
});
const $route = {
  path: "/videolist"
};
const wrapper = mount(VideoList, {
  store,
  localVue,
  mocks: {
    $route
  },
  stubs: {
    "base-icon": true,
    "v-ons-button": true,
    "v-ons-dialog": true,
    "v-ons-list": true,
    "v-ons-list-item": true,
    "v-ons-page": true,
    "v-ons-toolbar": true,
    "v-ons-toolbar-button": true,
    "v-ons-popover": true
  },
  directives: {
    lazy: true
  }
});

describe("VideoList", () => {
  it("Loads latest videos", () => {
    // console.log(wrapper.html());
    expect(wrapper.vm.getLatests.length).toBe(1);
  });
  it("Loads highlighted videos", () => {
    // console.log(wrapper.html());
    expect(wrapper.vm.getHighlighted.length).toBe(2);
  });
});
