import mockEmitter from "../../emitter";
import mockMedia from "../../db/media";
import mediaState from "../store/modules/media/state";

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

import { shallowMount, createLocalVue } from "@vue/test-utils";
import VideoList from "@/pages/VideoList.vue";
import VueLazyload from "vue-lazyload";
import Vuex from "vuex";
import mediaGetters from "@/store/modules/media/getters";
import mediaMutations from "@/store/modules/media/mutations";
import mediaActions from "@/store/modules/media/actions";
import userGetters from "@/store/modules/user/getters";
import webSocketService from "@/util/webSocketService.js";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueLazyload);

let store;
let wrapper;

describe("VideoList", () => {
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        uistates: {
          namespaced: true,
          actions: {
            setTaskQueue: jest.fn()
          }
        },
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
    wrapper = shallowMount(VideoList, {
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
  });
  it("Loads highlighteds videos", () => {
    expect(wrapper.vm.getHighlighteds.length).toBe(2);
  });
  it("Loads cryptos videos", () => {
    expect(wrapper.vm.getCryptos.length).toBe(3);
  });
  it("Loads gamings videos", () => {
    expect(wrapper.vm.getGamings.length).toBe(2);
  });
  it("Loads others videos", () => {
    expect(wrapper.vm.getOthers.length).toBe(3);
  });
  it("should open terms dialog if user didn't agree yet and send interests", () => {
    const storeUserNoTermsAndInterests = new Vuex.Store({
      modules: {
        uistates: {
          namespaced: true,
          actions: {
            setTaskQueue: jest.fn()
          }
        },
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
  it("should open interests dialog if user agreed terms but didn't send interests", () => {
    const storeUserTermsNoInterests = new Vuex.Store({
      modules: {
        uistates: {
          namespaced: true,
          actions: {
            setTaskQueue: jest.fn()
          }
        },
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
  it("should not open any dialogs if user agreed terms and sent interests", () => {
    const storeUserTermsNoInterests = new Vuex.Store({
      modules: {
        uistates: {
          namespaced: true,
          actions: {
            setTaskQueue: jest.fn()
          }
        },
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
  it("should delete media from the list", async () => {
    const response = {
      data: [
        {
          mediaCategories: [
            {
              id: "60e829483ef4050017f2c535",
              name: "other"
            }
          ],
          createdAt: 1626442822848,
          updatedAt: 1626442822848,
          type: "video",
          live: true,
          earn: false,
          balanceTotal: 100,
          balanceAvailable: 100,
          mediaID: "6886498e1eebed311db295eaef84b7c6",
          publisher: {
            walletAddress: "0x8DDF7bA89B9b99a7dAd755b975718BdDE9Fd7c0E"
          },
          shop: {},
          list: {
            highlighted: false,
            order: 0
          },
          statistics: {
            total: {
              views: 0,
              viewers: 0,
              reportFlags: 0,
              tips: 0
            }
          },
          details: {
            title: "JAM#5: Adam on building gFam Live",
            twitter: {
              hashtags: ["WebMonetization", "GrantfortheWeb", "JustAMeme"]
            }
          }
        }
      ]
    };
    webSocketService.socket.emit("media-deleted", response);
    expect(wrapper.vm.getOthers.length).toBe(2);
  });
  // it("should add media to the list", async () => {
  //   const response = {
  //     data: {
  //       _id: {
  //         $oid: "newid"
  //       },
  //       type: "video",
  //       live: false,
  //       publisher: {
  //         walletAddress: "newUserWallet"
  //       },
  //       mediaID: "newmediaid",
  //       shop: {
  //         link: "https://www.example.com"
  //       },
  //       statistics: {
  //         total: {
  //           viewers: 0,
  //           reportFlags: 0,
  //           tips: 5
  //         }
  //       },
  //       details: {
  //         title: "New Title",
  //         twitter: {
  //           hashtags: ["new", "science", "math"]
  //         }
  //       },
  //       code: "newcode",
  //       createdAt: 1608126993949,
  //       updatedAt: 1608126993949,
  //       list: {
  //         highlighted: false,
  //         order: 5
  //       }
  //     }
  //   };
  //   webSocketService.socket.emit("media-added", response);
  //   expect(wrapper.vm.getLatests.length).toBe(2);
  // });
});
