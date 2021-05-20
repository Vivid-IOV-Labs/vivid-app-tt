import ApiService from "./ApiService";

const API_ENDPOINT = "/rewards";

class RewardService {
  async getRewardList(userWalletAddress) {
    const {
      data: { rewardsList }
    } = await ApiService.get(
      `${API_ENDPOINT}/list?userWalletAddress=${userWalletAddress}`
    );
    return rewardsList;
  }
  async send({ userWalletAddress, mediaID, percentageWatched }) {
    const { data } = await ApiService.post(`${API_ENDPOINT}/send`, {
      userWalletAddress,
      mediaID,
      percentageWatched
    });
    return data;
  }
}

export default new RewardService();
