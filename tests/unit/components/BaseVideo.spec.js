import mockPlyr from "../../plyrMock";

jest.mock("plyr", () => {
  return mockPlyr;
});
jest.mock("@/util/analytics.js", () => {
  return { trackEvent: jest.fn() };
});
import { shallowMount } from "@vue/test-utils";
import BaseVideo from "@/components/BaseVideo";
import { trackEvent } from "@/util/analytics.js";

describe("BaseVideo", () => {
  it("should track event on play", async () => {
    const wrapper = shallowMount(BaseVideo, {
      propsData: { options: { captions: { active: false } } }
    });
    wrapper.vm.player.emit("play");
    expect(trackEvent).toHaveBeenCalled();
  });
  it("should track event on pause", async () => {
    const wrapper = shallowMount(BaseVideo, {
      propsData: { options: { captions: { active: false } } }
    });
    wrapper.vm.player.emit("pause");
    expect(trackEvent).toHaveBeenCalled();
  });
  it("should track event on ended", async () => {
    const wrapper = shallowMount(BaseVideo, {
      propsData: { options: { captions: { active: false } } }
    });
    wrapper.vm.player.emit("ended");
    expect(trackEvent).toHaveBeenCalled();
  });
});
