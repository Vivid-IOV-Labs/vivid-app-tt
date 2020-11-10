const address = "0x6915Ae0D5a9c08675Ce5c83b54228f3D3F1A6101";
const ABI = [
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
  },
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
  }
];
export { address, ABI };
