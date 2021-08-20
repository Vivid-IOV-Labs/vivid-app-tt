import actions from "@/store/modules/media/actions";

jest.mock("@/services/MediaService.js", () => {
  return {
    getAll: jest.fn().mockResolvedValue({ total: 0, media: [] }),
    populateCategory: jest.fn().mockResolvedValue({ total: 0, media: [] }),
    populateHighlighteds: jest.fn().mockResolvedValue({ total: 0, media: [] }),
    populateEarnLatests: jest.fn().mockResolvedValue({ total: 0, media: [] }),
    populateEarnCompleted: jest.fn().mockResolvedValue({ total: 0, media: [] })
  };
});
describe("Media Actions", () => {
  it("should populates Peerkat Watch", async () => {
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
  it("should populate Peerkat Earn", async () => {
    const context = {
      commit: jest.fn(),
      rootGetters: { "user/getWallet": "userWalletAddress" }
    };
    await actions.populateEarn(context);
    expect(context.commit.mock.calls[0][0]).toEqual("setEarnLatests");
    expect(context.commit.mock.calls[1][0]).toEqual("setTotalEarnLatests");
    expect(context.commit.mock.calls[2][0]).toEqual("setEarnCompleted");
    expect(context.commit.mock.calls[3][0]).toEqual("setTotalEarnCompleted");
  });
  // it("should delete media from the list", async () => {
  //   const response = {
  //     data: {
  //       _id: {
  //         $oid: "5fda12118caaa33468ef054e"
  //       },
  //       type: "video",
  //       live: false,
  //       publisher: {
  //         walletAddress: "19236501263508hfdsg871"
  //       },
  //       mediaID: "451299675670168564816463",
  //       shop: {
  //         link: "https://www.example.com"
  //       },
  //       statistics: {
  //         total: {
  //           viewers: 0,
  //           reportFlags: 0,
  //           tips: 5
  //         }
  //       },
  //       details: {
  //         title: "Crypto Market Update",
  //         twitter: {
  //           hashtags: ["crypto", "market", "2021"]
  //         }
  //       },
  //       code: "L8Z0YK0L9Y72S21WVOJ4",
  //       createdAt: 1608126993949,
  //       updatedAt: 1608126993949,
  //       list: {
  //         highlighted: false,
  //         order: 5
  //       }
  //     }
  //   };
  //   webSocketService.socket.emit("media-deleted", response);
  //   expect(wrapper.vm.getLatests.length).toBe(0);
  // });
});
