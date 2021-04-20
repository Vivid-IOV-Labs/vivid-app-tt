import mockEmitter from "../../emitter";
import mockMedia from "../../db/media";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import VideoList from "@/pages/VideoList.vue";
import VueLazyload from "vue-lazyload";
import Vuex from "vuex";
import mediaGetters from "@/store/modules/media/getters";
import mediaMutations from "@/store/modules/media/mutations";
import mediaActions from "@/store/modules/media/actions";
import userGetters from "@/store/modules/user/getters";

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

const wrapper = shallowMount(VideoList, {
  store,
  localVue,
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
    expect(wrapper.vm.getLatests.length).toBe(1);
  });
  it("Loads highlighted videos", () => {
    expect(wrapper.vm.getHighlighted.length).toBe(2);
  });
  it("Opens Terms dialog if user didn't agree yet and send interests", () => {
    const storeUserNoTermsAndInterests = new Vuex.Store({
      modules: {
        user: {
          namespaced: true,
          getters: {
            getTermsAgreed: () => false,
            getInterestsSubmitted: () => false
          }
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
    const wrapperUserNoTermsAndInterests = shallowMount(VideoList, {
      store: storeUserNoTermsAndInterests,
      localVue,
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
    expect(wrapperUserNoTermsAndInterests.vm.isTermsAgreeDialog).toBeTruthy();
    expect(wrapperUserNoTermsAndInterests.vm.isContentFeedDialog).toBeFalsy();
  });
  it("Opens Interests dialog if user agreed terms but didn't send interests", () => {
    const storeUserTermsNoInterests = new Vuex.Store({
      modules: {
        user: {
          namespaced: true,
          getters: {
            getTermsAgreed: () => true,
            getInterestsSubmitted: () => false
          }
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
    const wrapperUserNoTermsAndInterests = shallowMount(VideoList, {
      store: storeUserTermsNoInterests,
      localVue,
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
    expect(wrapperUserNoTermsAndInterests.vm.isTermsAgreeDialog).toBeFalsy();
    expect(wrapperUserNoTermsAndInterests.vm.isContentFeedDialog).toBeTruthy();
  });
  it("Doesn't open any dialogs if user agreed terms and sent interests", () => {
    const storeUserTermsNoInterests = new Vuex.Store({
      modules: {
        user: {
          namespaced: true,
          getters: {
            getTermsAgreed: () => true,
            getInterestsSubmitted: () => true
          }
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
    const wrapperUserNoTermsAndInterests = shallowMount(VideoList, {
      store: storeUserTermsNoInterests,
      localVue,
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
    expect(wrapperUserNoTermsAndInterests.vm.isTermsAgreeDialog).toBeFalsy();
    expect(wrapperUserNoTermsAndInterests.vm.isContentFeedDialog).toBeFalsy();
  });
});
