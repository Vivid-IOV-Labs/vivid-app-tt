import ApiService from "./ApiService";

const API_ENDPOINT = "/media";

class MediaService {
  async getAll() {
    const {
      data: { allMedia }
    } = await ApiService.get(`${API_ENDPOINT}/list/`);
    return allMedia;
  }
}

export default new MediaService();
