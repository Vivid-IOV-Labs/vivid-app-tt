import Web3 from "web3";
import devLog from "@/util/devlog.js";

/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */

let getWeb3 = new Promise(function(resolve, reject) {
  // Check for injected web3 (mist/metamask)
  var web3js = window.web3;
  if (typeof web3js !== "undefined") {
    devLog(web3js.currentProvider);

    try {
      let ethereum = window.ethereum;
      // Request account access if needed
      ethereum.enable().then(() => {
        resolve({
          web3js
        });
      });
    } catch (error) {
      // User denied account access...
      devLog("ethereum did not enable");
    }
  } else {
    // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
    reject(new Error("Unable to connect to Metamask"));
  }
})
  .then(result => {
    return new Promise(function(resolve, reject) {
      var web3 = new Web3(result.web3js.currentProvider);
      devLog(web3);

      if (!web3) {
        reject(new Error("Unable to create new Web3 instance"));
      } else {
        result = Object.assign({}, result, {
          injectedWeb3: web3.isConnected()
        });
        result = Object.assign({}, result, {
          web3() {
            return web3;
          }
        });

        resolve(result);
      }
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve network ID
      result.web3().version.getNetwork((err, networkId) => {
        if (err) {
          // If we can't find a networkId keep result the same and reject the promise
          reject(new Error("Unable to retrieve network ID"));
        } else {
          // Assign the networkId property to our result and resolve promise
          result = Object.assign({}, result, { networkId });
          resolve(result);
        }
      });
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve coinbase
      result.web3().eth.getCoinbase((err, coinbase) => {
        devLog(coinbase);
        if (err) {
          reject(new Error("Unable to retrieve coinbase"));
        } else {
          result = Object.assign({}, result, { coinbase });
          resolve(result);
        }
      });
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve balance for coinbase
      devLog(result);
      result.web3().eth.getBalance(result.coinbase, (err, balance) => {
        if (err) {
          reject(
            new Error(
              "Unable to retrieve balance for address: " + result.coinbase
            )
          );
        } else {
          result = Object.assign({}, result, { balance });
          resolve(result);
        }
      });
    });
  });

export default getWeb3;
