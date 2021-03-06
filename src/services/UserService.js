import ApiService from "./ApiService";

const API_ENDPOINT = "/users";

class UserService {
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
}

export default new UserService();
