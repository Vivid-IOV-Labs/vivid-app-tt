import {
  address as smartContractAddress,
  ABI as smartContractABI
} from "@/util/constants/tippingContract";
import { ethers } from "ethers";

// const provider = new ethers.providers.Web3Provider(window.ethereum)

const getSmartContract = async ({ web3, signer }) => {
  const smartContractProvider = web3();
  const tippingContract = await new ethers.Contract(
    smartContractAddress,
    smartContractABI,
    smartContractProvider
  );
  const tippingContractWithSigner = await tippingContract.connect(signer);
  return tippingContractWithSigner;
};
export default getSmartContract;
