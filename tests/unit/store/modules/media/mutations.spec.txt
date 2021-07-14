import mockMedia from "../../../../db/media";
import mutations from "@/store/modules/media/mutations";

const mediaState = () => ({
  all: mockMedia
});

describe("Media Mutations", () => {
  it("should set tips correctly", async () => {
    const state = mediaState();
    const mediaID = "401758123793384235894995";
    const totalTips = 200;
    mutations.setTotalTip(state, { mediaID, totalTips });
    const mediaUpdated = state.all.find(media => media.mediaID === mediaID);
    expect(mediaUpdated.statistics.total.tips).toEqual(totalTips);
  });
});
