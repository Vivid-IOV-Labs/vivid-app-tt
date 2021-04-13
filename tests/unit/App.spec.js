import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import BaseIconSprite from "@/components/BaseIconSprite.vue";
import RouterWrapper from "@/components/RouterWrapper.vue";

describe("App", () => {
  const wrapper = shallowMount(App);

  it("contains SvgSprites and Router", () => {
    expect(wrapper.findComponent(BaseIconSprite).exists()).toBe(true);
    expect(wrapper.findComponent(RouterWrapper).exists()).toBe(true);
  });
});
