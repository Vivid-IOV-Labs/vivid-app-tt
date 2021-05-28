const address = "0xAc2CC56c3177126a78A735C23fb4E5d9a9551196";
const ABI = [
  {
    constant: true,
    inputs: [],
    name: "amount",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_addr",
        type: "address"
      }
    ],
    name: "tip",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Tip",
    type: "event"
  }
];
export { address, ABI };
