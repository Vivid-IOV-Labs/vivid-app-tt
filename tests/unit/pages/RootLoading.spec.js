jest.mock("@/util/getSmartContractFactory", () => {
  return jest.fn().mockResolvedValue({
    signerAddress: "",
    signerBalance: "",
    smartContractWithSigner: {}
  });
});
jest.mock("@/services/UserService.js", () => {
  return {
    login: jest.fn().mockResolvedValue({
      statistics: {
        interestsSubmitted: true,
        total: {
          interests: 0
        }
      },
      createdAt: 1616418283266,
      updatedAt: 1616418283266,
      latestTermsAgreed: null
    })
  };
});
jest.mock("@/util/analytics.js", () => {
  return { trackEvent: jest.fn(), trackUser: jest.fn() };
});
import RootLoading from "@/pages/RootLoading.vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import userActions from "@/store/modules/user/actions";
import userMutations from "@/store/modules/user/mutations";
import smartcontractGetters from "@/store/modules/smartcontract/getters";
import { login } from "@/services/UserService.js";
import { trackUser } from "@/util/analytics.js";
import getSmartContractFactory from "@/util/getSmartContractFactory";

const smartContractState = () => ({
  signer: {
    address: "userWalletAddress"
  }
});
const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    smartcontract: {
      namespaced: true,
      state: smartContractState(),
      getters: smartcontractGetters,
      actions: {
        createSmartContractFactory: jest
          .fn()
          .mockResolvedValue({ message: "ok" })
      }
    },
    user: {
      namespaced: true,
      actions: userActions,
      mutations: userMutations
    }
  }
});
shallowMount(RootLoading, {
  store,
  localVue,
  stubs: {
    "v-ons-page": true
  }
});

describe("RootLoading", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // it("Logins and track User", async () => {
  //   //expect(login).toHaveBeenCalled();
  //   expect(trackUser).toHaveBeenCalled();
  // });
  it("Init SmartContract", async () => {
    //expect(getSmartContractFactory).toHaveBeenCalled();
  });
});
