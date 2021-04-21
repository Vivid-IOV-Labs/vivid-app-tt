import { shallowMount } from "@vue/test-utils";
import BaseCheckButton from "@/components/BaseCheckButton";
import Button from "../../stubs/Button";

describe("BaseCheckButton", () => {
  it("should act as an input checkbox with array model", async () => {
    const wrapper = shallowMount(BaseCheckButton, {
      propsData: {
        text: "Test",
        name: "test",
        value: []
      },
      stubs: {
        "v-ons-button": Button
      }
    });
    expect(wrapper.attributes().role).toBe("checkbox");
    await wrapper.trigger("click");
    expect(wrapper.emitted("input")).toBeTruthy();
    expect(wrapper.emitted().input.flat(2).length).toBe(1);
    expect(wrapper.emitted().input.flat(2)[0]).toBe("test");
  });
  it("should be selectable", async () => {
    const value = ["test"];
    const wrapper = shallowMount(BaseCheckButton, {
      propsData: {
        text: "Test",
        name: "test",
        selected: true,
        value
      },
      stubs: {
        "v-ons-button": Button
      }
    });
    expect(wrapper.vm.selected).toBe(true);
    expect(wrapper.attributes().checked).toBeTruthy();
    expect(wrapper.classes("btn-check--selected")).toBe(true);
  });
  it("should be unselectable", async () => {
    const value = ["test"];
    const wrapper = shallowMount(BaseCheckButton, {
      propsData: {
        text: "Test",
        name: "test",
        value
      },
      stubs: {
        "v-ons-button": Button
      }
    });
    expect(wrapper.vm.selected).toBe(false);
    expect(wrapper.attributes().checked).toBeFalsy();
    expect(wrapper.classes("btn-check--selected")).toBe(false);
  });
  it("should limit selection", async () => {
    const value = ["first", "second"];
    const wrapper = shallowMount(BaseCheckButton, {
      propsData: {
        text: "Test",
        name: "test",
        limit: 2,
        value
      },
      stubs: {
        "v-ons-button": Button
      }
    });
    await wrapper.trigger("click");
    const emitted = wrapper.emitted().input.flat(2);
    const { length } = emitted;
    expect(length).toBe(2);
    expect(emitted[length - 1]).toBe("test");
  });
});
