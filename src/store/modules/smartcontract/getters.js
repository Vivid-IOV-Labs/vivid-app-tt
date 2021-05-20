export default {
  myWalletAddress: state => state.myWalletAddress,
  getStreamerWalletAddress: state => state.streamerWalletAddress,
  getSigner: state => state.signer,
  getBalance: state => state.signer.balance,
  getUserWalletAddress: state => state.signer.address,
  getSmartContract: state => state.smartContract,
  getTipContract: state => state.smartContract
};
