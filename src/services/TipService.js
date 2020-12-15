import ApiService from "./ApiService";

const API_ENDPOINT = "/tips";

class TipService {
  async verify(body) {
    return await ApiService.post(`${API_ENDPOINT}/verify`, body);
  }
}

export default new TipService();
