import ApiService from "./ApiService";

const API_ENDPOINT = "/media";

class MediaService {
  async getAll() {
    return await ApiService.get(`${API_ENDPOINT}/list/`);
  }
}

export default new MediaService();
