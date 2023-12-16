export const ERC20Addrs = {
  ZERO_ADDR: "0x0000000000000000000000000000000000000000",
  ETH_ADDR: "0x000000000000000000000000000000000000800A",

  WETH_ADDR: "0xfa6a407c4c49ea1d46569c1a4bcf71c3437be54c",
  USDT_ADDR: "0x551197e6350936976dffb66b2c3bb15ddb723250",
  IZI_ADDR: "0xeb122de19fea9ed039e2d087113db26017f5f91a",
};

// export const swapContractAddress = "0x77132b63429718Db2B6ad8D942eE13A198f6Ab49"; // izumi
// export const swapContractAddress = "0xdD2F3e26B34f61fcFACBBcB227DB293F6aaA75a5"; // self1
export const swapContractAddress = "0xfdEA8c139F282b14E09D27528a316c7e8AA27878"; // self1

// export const approveGasLimit = 30_000n; // test

export const gasLimit = 1_800_000n; // test @PRD

export const defaultSlippage = 5; // @PRD

export const swapAbi = [
  {
    inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
    name: "multicall",
    outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "refundETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minAmount", type: "uint256" },
      { internalType: "address", name: "recipient", type: "address" },
    ],
    name: "unwrapWETH9",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
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

export const weth9Abi = [
  {
    constant: false,
    inputs: [{ name: "wad", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
