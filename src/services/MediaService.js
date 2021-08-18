import ApiService from "./ApiService";

const API_ENDPOINT = "/media";
function serialized(params) {
  return Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
}
class MediaService {
  async getAll(params) {
    const {
      data: { allMedia, totalMedia }
    } = await ApiService.get(`${API_ENDPOINT}/list?${serialized(params)}`);
    return { media: allMedia, total: totalMedia };
  }
  async find(params) {
    const url = `${API_ENDPOINT}?${serialized(params)}`;
    const {
      data: { media }
    } = await ApiService.get(url);
    return media;
  }
  async getRewardList(userWalletAddress) {
    const {
      data: { rewardsList }
    } = await ApiService.get(
      `${API_ENDPOINT}/rewards/list?userWalletAddress=${userWalletAddress}`
    );
    return rewardsList;
  }
  async videoViewed({ userWalletAddress, mediaID, percentageWatched }) {
    const { data, success } = await ApiService.post(`${API_ENDPOINT}/view`, {
      userWalletAddress,
      mediaID,
      percentageWatched
    });
    return { data, success };
  }
  async populateHighlighteds() {
    const params = {
      earn: false,
      sortBy: "list.order",
      order: "desc",
      page: 1,
      pageSize: 3,
      "list.highlighted": true
    };
    return await this.getAll(params);
  }
  async populateCategory(category) {
    const params = {
      earn: false,
      sortBy: "createdAt",
      order: "desc",
      page: 1,
      pageSize: 3,
      categories: JSON.stringify([category])
    };
    return await this.getAll(params);
  }
}

export default new MediaService();
