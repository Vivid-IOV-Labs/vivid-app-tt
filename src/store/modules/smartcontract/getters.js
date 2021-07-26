export default {
  myWalletAddress: state => state.myWalletAddress,
  getStreamerWalletAddress: state => state.streamerWalletAddress,
  getSigner: state => state.signer,
  getBalance: state => state.signer.balance,
  getUserWalletAddress: state => state.signer.address,
  getSmartContract: state => addressToTip => state.smartContract(addressToTip),
  getTipContract: state => async addressToTip =>
    await state.tipContract(addressToTip)
};
