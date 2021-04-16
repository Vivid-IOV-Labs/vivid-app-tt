import getSmartContractFactory from "@/util/getSmartContractFactory";
import { trackUser } from "@/util/analytics";

export default {
  namespaced: true,
  state: {
    signer: {
      address: null,
      balance: null
    },
    smartContract: null,
    tipContract: null
  },
  mutations: {
    setSigner(state, signer) {
      state.signer = signer;
    },
    setSmartContract(state, smartContract) {
      state.smartContract = smartContract;
    },
    setTipContract(state, tipContract) {
      state.smartContract = tipContract;
    }
  },
  getters: {
    myWalletAddress: state => state.myWalletAddress,
    getStreamerWalletAddress: state => state.streamerWalletAddress,
    getSigner: state => state.signer,
    getUserWalletAddress: state => state.signer.address,
    getSmartContract: state => state.smartContract,
    getTipContract: state => state.smartContract
  },
  actions: {
    async createSmartContractFactory({ commit }) {
      const {
        signerAddress,
        signerBalance,
        smartContractWithSigner,
        tipContract
      } = await getSmartContractFactory();
      commit("setSigner", { address: signerAddress, balance: signerBalance });
      trackUser(signerAddress);
      commit("setSmartContract", smartContractWithSigner);
      commit("setTipContract", tipContract);
    }
  }
};
