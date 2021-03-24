import ApiService from "./ApiService";

const API_ENDPOINT = "/media";

class MediaService {
  async getAll() {
    const {
      data: { allMedia }
    } = await ApiService.get(`${API_ENDPOINT}/list/`);
    return allMedia;
  }
  async videoViewed({ userWalletAddress, code }) {
    const { data } = await ApiService.post(`${API_ENDPOINT}/view`, {
      userWalletAddress,
      code
    });
    return data;
  }
}

export default new MediaService();
