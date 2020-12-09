import devLog from "@/util/devlog.js";
import { ethers } from "ethers";

/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */

let getWeb3 = new Promise(function(resolve, reject) {
  // Check for injected web3 (mist, metamask, etc...)
  let ethereum = window.ethereum;
  if (typeof ethereum !== "undefined") {
    try {
      // Request account access if needed
      ethereum.request({ method: "eth_requestAccounts" }).then(() => {
        debugger;
        resolve({
          ethereum
        });
      });
    } catch (error) {
      // User denied account access...
      devLog("ethereum user account access not given");
    }
  } else {
    reject(new Error("Unable to connect to injected web3 provider"));
  }
})
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Get ethereum web3 provider

      const provider = new ethers.providers.Web3Provider(result.ethereum);

      if (!provider) {
        reject(new Error("Unable to create new Web3 instance"));
      } else {
        // result = Object.assign({}, result, {
        //   injectedWeb3: web3.isConnected()
        // });

        result = Object.assign({}, result, {
          web3() {
            return provider;
          }
        });

        resolve(result);
      }
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve network details

      result
        .web3()
        .getNetwork()
        .then(network => {
          if (!network) {
            // If we can't find the network details keep result the same and reject the promise
            reject(new Error("Unable to retrieve network details"));
          } else {
            // Assign the network details property to our result and resolve promise
            result = Object.assign({}, result, { network });

            resolve(result);
          }
        })
        .catch(err => {
          devLog(err);
          reject(new Error("Error when calling getNetwork()"));
        });
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Get signer

      try {
        const signer = result.web3().getSigner();
        result = Object.assign({}, result, { signer });

        resolve(result);
      } catch (error) {
        // Failed to get signer
        reject(new Error("Unable to retrieve signer"));
      }
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Get signer address

      result.signer
        .getAddress()
        .then(signerAddress => {
          result = Object.assign({}, result, { signerAddress });
          resolve(result);
        })
        .catch(err => {
          devLog(err);
          reject(new Error("Unable to retrieve signer address"));
        });
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve balance for signer

      result
        .web3()
        .getBalance(result.signerAddress)
        .then(balance => {
          let signerBalance = ethers.utils.formatEther(balance);
          result = Object.assign({}, result, { signerBalance });

          resolve(result);
        })
        .catch(err => {
          devLog(err);
          reject(new Error("Unable to retrieve signer balance"));
        });
    });
  });

export default getWeb3;
