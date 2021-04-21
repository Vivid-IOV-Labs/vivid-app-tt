jest.mock("@/util/analytics.js", () => {
  return { trackEvent: jest.fn() };
});
import ContentFeedDialog from "@/components/dialogs/ContentFeedDialog";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Button from "../../../stubs/Button";
import { trackEvent } from "@/util/analytics.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const addUserInterests = jest.fn().mockResolvedValue(true);
const store = new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      actions: {
        addUserInterests
      }
    }
  }
});

const wrapper = shallowMount(ContentFeedDialog, {
  store,
  localVue,
  stubs: {
    "base-icon": true,
    "v-ons-button": Button,
    "v-ons-dialog": true
  }
});
describe("ContentFeedDialog", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send feedback of content selected", async () => {
    const sendFeedBackButton = wrapper.get("[data-testid='send-feedback']");
    await wrapper.setData({ contentSelected: ["science", "crypto"] });
    await wrapper.vm.$nextTick();
    await sendFeedBackButton.trigger("click");
    await wrapper.vm.addUserInterests();
    expect(addUserInterests).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenNthCalledWith(1, {
      action: "send-feedback",
      category: "Interest Feedback View",
      label: "science"
    });
    expect(trackEvent).toHaveBeenNthCalledWith(2, {
      action: "send-feedback",
      category: "Interest Feedback View",
      label: "crypto"
    });
  });
  it("should not send feedback when content is not selected", async () => {
    const sendFeedBackButton = wrapper.get("[data-testid='send-feedback']");
    const sendFeedBack = jest.spyOn(wrapper.vm, "sendFeedBack");
    await sendFeedBackButton.trigger("click");
    expect(sendFeedBack).not.toHaveBeenCalled();
  });
});
