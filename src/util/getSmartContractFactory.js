import {
  address as tippingContractAddress,
  ABI as tippingContractABI
} from "@/util/constants/tippingContract";
import {
  address as testNetTippingContractAddress,
  ABI as testNetTippingContractABI
} from "@/util/constants/testNetTippingContract";
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

const getTippingContractWithSigner = async (smartContractProvider, signer) => {
  const tippingContract = await new ethers.Contract(
    tippingContractAddress,
    tippingContractABI,
    smartContractProvider
  );
  return await tippingContract.connect(signer);
};

const getTestNetTippingContractWithSigner = async (
  smartContractProvider,
  signer
) => {
  const tippingContract = await new ethers.Contract(
    testNetTippingContractAddress,
    testNetTippingContractABI,
    smartContractProvider
  );
  return await tippingContract.connect(signer);
};

const createTippingContratc = (
  contractWithSigner,
  addressToTip = "0x8DDF7bA89B9b99a7dAd755b975718BdDE9Fd7c0E",
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
  const { chainId } = network;
  const isTippingContract = chainId == 108;
  const smartContractWithSigner = isTippingContract
    ? await getTippingContractWithSigner(provider, signer)
    : await getTestNetTippingContractWithSigner(provider, signer);
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
