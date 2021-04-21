import RootLoading from "@/pages/RootLoading.vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

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
        getUserWalletAddress: () => "userWalletAddress"
      }
    },
    user: {
      namespaced: true,
      actions: { login: loginMock }
    }
  }
});
const wrapper = shallowMount(RootLoading, {
  store,
  localVue,
  stubs: {
    "v-ons-page": true
  }
});

describe("RootLoading", () => {
  it("Logins user", async () => {
    await wrapper.vm.$nextTick();
    expect(loginMock).toHaveBeenCalled();
  });
  it("Inits SmartContract", () => {
    expect(createSmartContractFactoryMock).toHaveBeenCalled();
  });
});
