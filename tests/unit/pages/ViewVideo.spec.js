import mockEmitter from "../../emitter";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ViewVideo from "@/pages/ViewVideo.vue";
import Vuex from "vuex";
import mediaDb from "../../db/media";
// import mockWebSocketService from "@/util/webSocketService.js";
import { trackEvent } from "@/util/analytics.js";
import mediaGetters from "../../../src/store/modules/media/getters";
import mediaState from "../../../src/store/modules/media/state";
import mediaMutations from "../../../src/store/modules/media/mutations";
import mediaActions from "../../../src/store/modules/media/actions";
import smartcontractGetters from "../../../src/store/modules/smartcontract/getters";
import Plyr from "plyr";

jest.mock("@/util/webSocketService.js", () => {
  const socket = mockEmitter;
  const webSocketService = {
    socket
  };
  return webSocketService;
});
jest.mock("plyr", () => {
  return function() {
    return mockEmitter;
  };
});
jest.mock("@/util/analytics.js", () => {
  return { trackEvent: jest.fn() };
});
jest.mock("@/services/TipService.js", () => {
  return { verify: jest.fn().mockResolvedValue({ message: "ok" }) };
});
jest.mock("@/services/MediaService.js", () => {
  return {
    find: jest.fn().mockResolvedValue({
      _id: {
        $oid: "5fda11d78caaa33468ef054d"
      },
      type: "video",
      live: false,
      publisher: {
        walletAddress: "19236501263508hfdsg871"
      },
      mediaID: "401758123793384235894995",
      shop: {
        link: "https://www.example.com"
      },
      statistics: {
        total: {
          viewers: 1,
          reportFlags: 0,
          tips: 8,
          views: 12
        }
      },
      details: {
        title: "Thundercore Intro",
        twitter: {
          hashtags: ["crypto", "market", "2021"]
        }
      },
      code: "VJQX09X5R0KYUQR0MJ9Z",
      createdAt: 1608126935666,
      updatedAt: 1608126935666,
      list: {
        highlighted: true,
        order: 21
      }
    })
  };
});

const smartContractState = () => ({
  signer: {
    address: "userWalletAddress"
  },
  tipContract: jest.fn().mockResolvedValue({
    wait: jest.fn().mockResolvedValue({ transactionHash: "#transactionHash" })
  })
});
const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    uistates: {
      namespaced: true,
      isTTPopOverVisited: true
    },
    smartcontract: {
      namespaced: true,
      state: smartContractState(),
      getters: smartcontractGetters
    },
    media: {
      namespaced: true,
      state: mediaState(),
      getters: mediaGetters,
      actions: mediaActions,
      mutations: mediaMutations
    }
  }
});
const $route = {
  path: "/viewvideo/401758123793384235894995",
  params: {
    mediaID: "401758123793384235894995"
  }
};
const wrapper = shallowMount(ViewVideo, {
  store,
  localVue,
  mocks: {
    $route
  },
  stubs: {
    "base-video": {
      template: `<div >
      <slot name="top"></slot>
      <video
        id="video"
      ></video>
      <slot name="bottom"></slot>
    </div>`,
      data: function() {
        return {
          player: new Plyr("#video")
        };
      }
    },
    "base-icon": true,
    "v-ons-page": true,
    "v-ons-popover": true,
    "v-ons-button": true
  }
});

describe("ViewVideo", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await wrapper.setData({
      isVideoMenuDropped: false,
      isFullScreen: false,
      isTipping: false,
      isPopoverClickTT: false,
      isPopoverTTSuccess: false,
      isPopoverTTFailed: false,
      isPopoverTTProgress: false
    });
  });
  it("should displays title correctly", async () => {
    expect(wrapper.get(".stream-detail__title").text()).toBe(
      "Thundercore Intro"
    );
  });
  it("should displays hashtags correctly", async () => {
    expect(wrapper.get(".stream-detail__hashtag").text()).toBe(
      "#crypto, #market, #2021"
    );
  });
  it("should attempts HLS and autoplays on loaded", async () => {
    const spyOnAttachHls = jest
      .spyOn(ViewVideo.methods, "attachHls")
      .mockImplementation();
    const spyOnautoplay = jest
      .spyOn(ViewVideo.methods, "autoplay")
      .mockImplementation();
    wrapper.vm.player.on("ready", () => {
      expect(spyOnAttachHls).toHaveBeenCalled();
      expect(spyOnautoplay).toHaveBeenCalled();
      expect(trackEvent).toHaveBeenCalled();
    });
  });
  it("should counts video viewd on end", async () => {
    const countVideoViewed = jest
      .spyOn(ViewVideo.methods, "countVideoViewed")
      .mockImplementation();
    wrapper.vm.player.on("ended", () => {
      expect(countVideoViewed).toHaveBeenCalled();
    });
  });
  // it("should updates total tips on websocket", async () => {
  //   const response = {
  //     data: {
  //       totalTips: 10,
  //       mediaID: "401758123793384235894995",
  //       sender: { walletAddress: "userWalletAddress" }
  //     }
  //   };
  //   mockWebSocketService.socket.emit("media-updated-tip", response);
  //   await wrapper.vm.$nextTick();
  //   const totalTips = wrapper.find("#total-tips").text();
  //   expect(totalTips).toBe(response.data.totalTips.toString());
  //   expect(wrapper.vm.isPopoverTTProgress).toBeFalsy();
  //   expect(wrapper.vm.isPopoverTTSuccess).toBeTruthy();
  //   expect(trackEvent).toHaveBeenCalled();
  // });
  it("On tipStreamer hide popup", async () => {
    await wrapper.get("#tip-streamer").vm.$emit("click");
    expect(wrapper.vm.isPopoverClickTT).toBeFalsy();
    expect(wrapper.vm.isPopoverTTProgress).toBeTruthy();
    expect(wrapper.vm.isTipping).toBeTruthy();
  });
  // it("should not update tip if mediaID is different", async () => {
  //   const response = {
  //     data: {
  //       totalTips: 10000,
  //       mediaID: "anotherMedia",
  //       sender: { walletAddress: "anotherUserWalletAddress" }
  //     }
  //   };
  //   mockWebSocketService.socket.emit("media-updated-tip", response);
  //   await wrapper.vm.$nextTick();
  //   const totalTips = wrapper.find("#total-tips").text();
  //   expect(totalTips).toBe("10");
  //   expect(wrapper.vm.isPopoverTTSuccess).toBeFalsy();
  // });
  // it("should not show tip done if the sender is not the user", async () => {
  //   const response = {
  //     data: {
  //       totalTips: 100,
  //       mediaID: "401758123793384235894995",
  //       sender: { walletAddress: "anotherUserWalletAddress" }
  //     }
  //   };
  //   mockWebSocketService.socket.emit("media-updated-tip", response);
  //   await wrapper.vm.$nextTick();
  //   const totalTips = wrapper.find("#total-tips").text();
  //   expect(totalTips).toBe("100");
  //   expect(wrapper.vm.isPopoverTTSuccess).toBeFalsy();
  // });
  // it("should format tips", async () => {
  //   const response = {
  //     data: {
  //       totalTips: 10000,
  //       mediaID: "401758123793384235894995",
  //       sender: { walletAddress: "anotherUserWalletAddress" }
  //     }
  //   };
  //   mockWebSocketService.socket.emit("media-updated-tip", response);
  //   await wrapper.vm.$nextTick();
  //   const totalTips = wrapper.find("#total-tips").text();
  //   expect(totalTips).toBe("10K");
  // });
});
