import {
  address as smartContractAddress,
  ABI as smartContractABI
} from "@/util/constants/tippingContract";
import { ethers } from "ethers";
import devLog from "@/util/devlog.js";

const requestEthereum = async () => {
  let ethereum = window.ethereum;
  if (typeof ethereum !== "undefined") {
    try {
      return await ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      devLog("ethereum user account access not given", err);
    }
  } else {
    devLog("Unable to connect to injected web3 provider");
  }
};

const getNetwork = async provider => {
  try {
    const network = await provider.getNetwork();
    if (!network) {
      devLog("Unable to retrieve network details");
    } else {
      return network;
    }
  } catch (err) {
    devLog("Error when calling getNetwork()", err);
  }
};

const getSigner = provider => {
  const signer = provider.getSigner();
  return signer;
};

const getSignerAddress = async (provider, signer) => {
  try {
    return await signer.getAddress();
  } catch (err) {
    devLog("Unable to retrieve signer address", err);
  }
};

const getSignerBalance = async (provider, signerAddress) => {
  try {
    const signerBalance = await provider.getBalance(signerAddress);
    return ethers.utils.formatEther(signerBalance);
  } catch (err) {
    devLog("Unable to retrieve signer balance", err);
  }
};

const getSmartContractWithSigner = async (smartContractProvider, signer) => {
  const tippingContract = await new ethers.Contract(
    smartContractAddress,
    smartContractABI,
    smartContractProvider
  );
  return await tippingContract.connect(signer);
};
//Nikos 0x38ffA90E1D92D61D7Fe0B6A54cfa9FD5e743d645
//Ike 0x8DDF7bA89B9b99a7dAd755b975718BdDE9Fd7c0E
const createTippingContratc = (
  contractWithSigner,
  addressToTip = "0x38ffA90E1D92D61D7Fe0B6A54cfa9FD5e743d645",
  { gasLimit, gasPrice, nonce, value } = {
    gasLimit: 250000,
    gasPrice: 9000000000,
    nonce: 0,
    value: "1.0"
  }
) => {
  const parsedValue = ethers.utils.parseEther(value);
  const options = {
    gasLimit,
    gasPrice,
    nonce,
    value: parsedValue
  };
  return async () => await contractWithSigner.tip(addressToTip, options);
};

const createGetSmartContract = async () => {
  await requestEthereum();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await getNetwork(provider);
  const signer = getSigner(provider);
  const signerAddress = await getSignerAddress(provider, signer);
  const signerBalance = await getSignerBalance(provider, signerAddress);
  const smartContractWithSigner = await getSmartContractWithSigner(
    provider,
    signer
  );
  const tipContract = createTippingContratc(smartContractWithSigner);
  return {
    provider,
    network,
    signer,
    signerAddress,
    signerBalance,
    smartContractWithSigner,
    tipContract
  };
};

export default createGetSmartContract;
// export default (async () => {
//   return await createGetSmartContract();
// })();
