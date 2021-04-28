import ApiService from "./ApiService";

const API_ENDPOINT = "/media";

class MediaService {
  async getAll(userWalletAddress) {
    const {
      data: { allMedia }
    } = await ApiService.get(
      `${API_ENDPOINT}/list?userWalletAddress=${userWalletAddress}`
    );
    return allMedia;
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
    const { data } = await ApiService.post(`${API_ENDPOINT}/view`, {
      userWalletAddress,
      mediaID,
      percentageWatched
    });
    return data;
  }
}

export default new MediaService();
