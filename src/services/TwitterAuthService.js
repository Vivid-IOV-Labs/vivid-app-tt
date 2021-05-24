import env from "@/env.js";
import ApiService from "./ApiService";

const API_ENDPOINT = "/auth";

class TwitterAuthService {
  authenticate(userWalletAddress) {
    window.open(
      `${env.web_service_url}${API_ENDPOINT}/twitter?userWalletAddress=${userWalletAddress}`,
      "_self"
    );
  }
  async disconnect(userWalletAddress) {
    return await ApiService.delete(
      `${env.web_service_url}/users/twitterProfile`,
      { params: { userWalletAddress } }
    );
  }
}

export default new TwitterAuthService();
