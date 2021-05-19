import RouterWrapper from "@/components/RouterWrapper.vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
jest.mock("@/util/analytics.js", () => {
  return { trackPage: jest.fn() };
});
const localVue = createLocalVue();
localVue.use(Vuex);

const loginMock = jest.fn();
const createSmartContractFactoryMock = jest.fn().mockResolvedValue();

const store = new Vuex.Store({
  modules: {
    smartcontract: {
      namespaced: true,
      actions: {
        createSmartContractFactory: createSmartContractFactoryMock
      },
      getters: {
        getUserWalletAddress: () => ""
      }
    },
    user: {
      namespaced: true,
      actions: { login: loginMock }
    }
  }
});
const $route = {
  path: "/",
  matched: []
};

const wrapper = shallowMount(RouterWrapper, {
  store,
  localVue,
  stubs: {
    "v-ons-navigator": true
  },
  mocks: {
    $route
  }
});

describe("RouterWrapper", () => {
  it("Logins user", async () => {
    await wrapper.vm.$nextTick();
    expect(loginMock).toHaveBeenCalled();
  });
  it("Inits SmartContract", async () => {
    await wrapper.vm.$nextTick();
    expect(createSmartContractFactoryMock).toHaveBeenCalled();
  });
});
