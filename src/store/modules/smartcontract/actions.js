import getSmartContractFactory from "@/util/getSmartContractFactory";
import { trackUser } from "@/util/analytics";

export default {
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
};
