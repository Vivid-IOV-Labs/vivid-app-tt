jest.mock("@/services/UserService.js", () => {
  return {
    login: jest
      .fn()
      .mockResolvedValue({ interestsSubmitted: false, termsAgreed: true }),
    registerInterests: jest.fn().mockResolvedValue({
      userWalletAddres: "userWalletAddress",
      interests: ["crypto", "science"]
    }),
    acceptTerms: jest
      .fn()
      .mockResolvedValue({ interestsSubmitted: false, termsAgreed: true })
  };
});
import actions from "@/store/modules/user/actions";
import {
  login,
  registerInterests,
  acceptTerms
} from "@/services/UserService.js";

describe("User Actions", () => {
  it("Registers user terms ", async () => {
    const context = {
      commit: jest.fn(),
      getters: {
        getWallet: () => "userWalletAddres"
      }
    };
    await actions.acceptTerms(context);
    expect(acceptTerms).toHaveBeenCalled();
    expect(context.commit.mock.calls[0][0]).toEqual("setTermsAgreed");
    expect(context.commit.mock.calls[0][1]).toEqual(true);
  });
  it("Registers user interests ", async () => {
    const context = {
      commit: jest.fn(),
      getters: {
        getWallet: () => "userWalletAddres"
      }
    };
    await actions.addUserInterests(context, ["crypto", "science"]);
    expect(registerInterests).toHaveBeenCalled();
    expect(context.commit.mock.calls[0][0]).toEqual("addUserInterests");
    expect(context.commit.mock.calls[0][1]).toEqual(["crypto", "science"]);
  });
  it("Logins user ", async () => {
    const context = {
      commit: jest.fn()
    };
    await actions.login(context, "userWalletAddress");
    expect(login).toHaveBeenCalled();
    expect(context.commit.mock.calls[0][0]).toEqual("setWallet");
    expect(context.commit.mock.calls[0][1]).toEqual("userWalletAddress");
    expect(context.commit.mock.calls[1][0]).toEqual("setInterestsSubmitted");
    expect(context.commit.mock.calls[1][1]).toEqual(false);
    expect(context.commit.mock.calls[2][0]).toEqual("setTermsAgreed");
    expect(context.commit.mock.calls[2][1]).toEqual(true);
  });
});
