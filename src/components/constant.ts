export const ERC20Addrs = {
  ZERO_ADDR: "0x0000000000000000000000000000000000000000",
  ETH_ADDR: "0x000000000000000000000000000000000000800A",

  WETH_ADDR: "0xfa6a407c4c49ea1d46569c1a4bcf71c3437be54c",
  USDT_ADDR: "0x551197e6350936976dffb66b2c3bb15ddb723250",
  // USDC_ADDR: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
};

export const swapContractAddress = "0x77132b63429718Db2B6ad8D942eE13A198f6Ab49";

export const swapAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "bytes", name: "path", type: "bytes" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint128", name: "amount", type: "uint128" },
          { internalType: "uint256", name: "minAcquired", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        internalType: "struct Izumi.SwapAmountParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "swapAmount",
    outputs: [
      { internalType: "uint256", name: "cost", type: "uint256" },
      { internalType: "uint256", name: "acquire", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
];
