import env from "@/env.js";

const API_ENDPOINT = "/auth";

class TwitterAuthService {
  authenticate(userWalletAddress) {
    window.open(
      `${env.web_service_url}${API_ENDPOINT}/twitter?userWalletAddress=${userWalletAddress}`,
      "_self"
    );
  }
}

export default new TwitterAuthService();
