export const mavPoolAdress = "0x57D47F505EdaA8Ae1eFD807A860A79A28bE06449";

export const ETH_USDC_POOL = "0x74a8f079eb015375b5dbb3ee98cbb1b91089323f";

export const zksERC20Addrs = {
  ZERO_ADDR: "0x0000000000000000000000000000000000000000",
  ETH_ADDR: "0x000000000000000000000000000000000000800A",
  WETH_ADDR: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
  USDC_ADDR: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
  LUSD_ADDR: "0x503234F203fC7Eb888EEC8513210612a43Cf6115",
  BUSD_ADDR: "0x2039bb4116B4EFc145Ec4f0e2eA75012D6C0f181",
  USDPLUS_ADDR: "0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557",
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
