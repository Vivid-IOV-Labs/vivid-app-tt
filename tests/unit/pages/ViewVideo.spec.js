import mockEmitter from "../../emitter";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ViewVideo from "@/pages/ViewVideo.vue";
import Vuex from "vuex";
import mediaDb from "../../db/media";
import mockWebSocketService from "@/util/webSocketService.js";
import { trackEvent } from "@/util/analytics.js";
import mediaGetters from "../../../src/store/modules/media/getters";
import mediaMutations from "../../../src/store/modules/media/mutations";
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
const mediaState = () => ({
  all: mediaDb,
  latests: mediaDb
    .filter(f => !f.list || !f.list.highlighted)
    .sort((a, b) => {
      return b.createdAt - a.createdAt;
    }),
  highlighted: mediaDb
    .filter(f => f.list && f.list.highlighted)
    .sort((a, b) => {
      return b.list.order - a.list.order;
    })
});
const smartContractState = () => ({
  signer: {
    address: "userWalletAddress"
  },
  smartContract: jest.fn().mockResolvedValue({
    wait: jest.fn().mockResolvedValue({ transactionHash: "#transactionHash" })
  })
});
const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    smartcontract: {
      namespaced: true,
      state: smartContractState(),
      getters: smartcontractGetters
    },
    media: {
      namespaced: true,
      state: mediaState(),
      getters: mediaGetters,
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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Displays title correctly", async () => {
    expect(wrapper.get(".stream-detail__title").text()).toBe(
      "Thundercore Intro"
    );
  });
  it("Displays hashtags correctly", async () => {
    expect(wrapper.get(".stream-detail__hashtag").text()).toBe(
      "#crypto, #market, #2021"
    );
  });
  it("Attempts HLS and autoplays on loaded", async () => {
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
  it("Counts video viewd on end", async () => {
    const countVideoViewed = jest
      .spyOn(ViewVideo.methods, "countVideoViewed")
      .mockImplementation();
    wrapper.vm.player.on("ended", () => {
      expect(countVideoViewed).toHaveBeenCalled();
    });
  });
  it("Updates total tips on websocket", async () => {
    const response = {
      data: {
        totalTips: 10,
        mediaID: "401758123793384235894995",
        sender: { walletAddress: "userWalletAddress" }
      }
    };
    mockWebSocketService.socket.emit("media-updated-tip", response);
    await wrapper.vm.$nextTick();
    const totalTips = wrapper.find("#total-tips").text();
    expect(totalTips).toBe(response.data.totalTips.toString());
    expect(wrapper.vm.isPopoverTTProgress).toBeFalsy();
    expect(wrapper.vm.isPopoverTTSuccess).toBeTruthy();
    expect(trackEvent).toHaveBeenCalled();
  });
  it("On tipStreamer hide popup", async () => {
    await wrapper.get("#tip-streamer").vm.$emit("click");
    expect(wrapper.vm.isPopoverClickTT).toBeFalsy();
    expect(wrapper.vm.isPopoverTTProgress).toBeTruthy();
    expect(wrapper.vm.isTipping).toBeTruthy();
    //expect(trackEvent).toHaveBeenCalled();
    ///  expect(verify).toHaveBeenCalled();
  });
});
