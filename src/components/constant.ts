export const mavPoolAdress = "0x57D47F505EdaA8Ae1eFD807A860A79A28bE06449";

export const ETH_USDC_POOL = "0x74a8f079eb015375b5dbb3ee98cbb1b91089323f";

export const ERC20Addrs = {
  ZERO_ADDR: "0x0000000000000000000000000000000000000000",
  ETH_ADDR: "0x000000000000000000000000000000000000800A",
  WETH_ADDR: "0xfa6a407c4c49ea1d46569c1a4bcf71c3437be54c",
  USDT_ADDR: "0x551197e6350936976dffb66b2c3bb15ddb723250",
  // USDC_ADDR: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
};

export const mavPoolCalculateAbi = [
  {
    inputs: [
      { internalType: "address", name: "pool", type: "address" },
      { internalType: "uint128", name: "amount", type: "uint128" },
      { internalType: "bool", name: "tokenAIn", type: "bool" },
      { internalType: "bool", name: "exactOutput", type: "bool" },
      { internalType: "uint256", name: "sqrtPriceLimit", type: "uint256" },
    ],
    name: "calculateSwap",
    outputs: [
      { internalType: "uint256", name: "returnAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
