import actions from "@/store/modules/media/actions";
jest.mock("@/services/MediaService.js", () => {
  return {
    getAll: jest.fn().mockResolvedValue({ total: 0, media: [] }),
    populateCategory: jest.fn().mockResolvedValue({ total: 0, media: [] }),
    populateHighlighteds: jest.fn().mockResolvedValue({ total: 0, media: [] })
  };
});

describe("Media Actions", () => {
  it("Populates Peerkat Watch", async () => {
    const context = {
      commit: jest.fn()
    };
    await actions.populateAll(context);
    expect(context.commit.mock.calls[0][0]).toEqual("setHighlighteds");
    expect(context.commit.mock.calls[1][0]).toEqual("setTotalHighlighteds");
    expect(context.commit.mock.calls[2][0]).toEqual("setCryptos");
    expect(context.commit.mock.calls[3][0]).toEqual("setTotalCryptos");
    expect(context.commit.mock.calls[4][0]).toEqual("setGamings");
    expect(context.commit.mock.calls[5][0]).toEqual("setTotalGamings");
    expect(context.commit.mock.calls[6][0]).toEqual("setOthers");
    expect(context.commit.mock.calls[7][0]).toEqual("setTotalOthers");
  });
  it("Populates Peerkat Earn", async () => {
    const context = {
      commit: jest.fn(),
      rootGetters: { "user/getWallet": "userWalletAddress" }
    };
    await actions.populateEarn(context);
    expect(context.commit.mock.calls[0][0]).toEqual("setEarnLatests");
    expect(context.commit.mock.calls[1][0]).toEqual("setEarnCompleted");
  });
});
