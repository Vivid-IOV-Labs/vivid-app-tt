import ApiService from "./ApiService";

const API_ENDPOINT = "/users";

class UserService {
  async profile(userWalletAddress) {
    const { data } = await ApiService.get(`${API_ENDPOINT}/profile`, {
      params: { userWalletAddress }
    });
    return data;
  }
  async login(userWalletAddress) {
    const { data } = await ApiService.post(`${API_ENDPOINT}/login`, {
      userWalletAddress
    });
    return data;
  }
  async registerInterests({ userWalletAddress, interests }) {
    const { data } = await ApiService.post(`${API_ENDPOINT}/register`, {
      userWalletAddress,
      interests
    });
    return data;
  }
  async acceptTerms({ userWalletAddress }) {
    const { data } = await ApiService.post(`${API_ENDPOINT}/agreeTerms`, {
      userWalletAddress
    });
    return data;
  }
}

export default new UserService();
