import mockMedia from "../../../../db/media";
jest.mock("@/services/MediaService.js", () => {
  return { getAll: jest.fn().mockResolvedValue(mockMedia) };
});
import actions from "@/store/modules/media/actions";

const mediaState = () => ({
  all: mockMedia,
  latests: mockMedia
    .filter(f => !f.list || !f.list.highlighted)
    .sort((a, b) => {
      return b.createdAt - a.createdAt;
    }),
  highlighted: mockMedia
    .filter(f => f.list && f.list.highlighted)
    .sort((a, b) => {
      return b.list.order - a.list.order;
    })
});
describe("Media Actions", () => {
  it("Loads media and populate state ", async () => {
    const context = {
      commit: jest.fn()
    };
    await actions.populateAll(context);
    expect(context.commit.mock.calls[0][0]).toEqual("setAll");
    expect(context.commit.mock.calls[0][1]).toEqual(mediaState().all);
    expect(context.commit.mock.calls[1][0]).toEqual("setLatests");
    expect(context.commit.mock.calls[1][1]).toEqual(mediaState().latests);
    expect(context.commit.mock.calls[2][0]).toEqual("setHighlighted");
    expect(context.commit.mock.calls[2][1]).toEqual(mediaState().highlighted);
  });
});
