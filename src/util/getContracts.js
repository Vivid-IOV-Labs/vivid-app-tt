import Web3 from "web3"
import { address, ABI } from "./constants/tippingContract"


let getContract = new Promise(function (resolve, reject) {
    let web3 = new Web3(window.web3.currentProvider)

    if (!ABI.length) reject(new Error("No ABI"))

    let tippingContract = web3.eth.contract(ABI)
    let tippingContractInstance = tippingContract.at(address)
    // casinoContractInstance = () => casinoContractInstance
    resolve(tippingContractInstance)
})
export default getContract