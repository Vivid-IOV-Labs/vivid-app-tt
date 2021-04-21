jest.mock("@/util/getSmartContractFactory", () => {
  return jest.fn().mockResolvedValue({
    signerAddress: "signerAddress",
    signerBalance: "signerBalance",
    smartContractWithSigner: "smartContractWithSigner",
    tipContract: "tipContract"
  });
});
jest.mock("@/util/analytics", () => {
  return {
    trackUser: jest.fn()
  };
});
import getSmartContractFactory from "@/util/getSmartContractFactory";
import { trackUser } from "@/util/analytics";
import actions from "@/store/modules/smartcontract/actions";

describe("SmartContract Actions", () => {
  it("Inits smart contract and track user from address ", async () => {
    const context = {
      commit: jest.fn()
    };
    await actions.createSmartContractFactory(context);
    expect(getSmartContractFactory).toHaveBeenCalled();
    expect(trackUser).toHaveBeenCalledWith("signerAddress");
    expect(context.commit.mock.calls[0][0]).toEqual("setSigner");
    expect(context.commit.mock.calls[0][1]).toEqual({
      address: "signerAddress",
      balance: "signerBalance"
    });
    expect(context.commit.mock.calls[1][0]).toEqual("setSmartContract");
    expect(context.commit.mock.calls[1][1]).toEqual("smartContractWithSigner");
    expect(context.commit.mock.calls[2][0]).toEqual("setTipContract");
    expect(context.commit.mock.calls[2][1]).toEqual("tipContract");
  });
});
