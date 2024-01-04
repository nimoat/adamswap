import { scrollSepolia } from "wagmi/chains";
import { Currency } from "./currencyMap";
import { defineChain } from "viem";

// 测试网-------------
const WETH_ADDR_alpha: Record<number, `0x${string}`> = {
  534351: "0xfa6a407c4c49ea1d46569c1a4bcf71c3437be54c",
};

const defaultWrapedTokenSymbol_alpha: Record<number, string> = {
  534351: "WETH",
};

const swapContractAddress_alpha: Record<number, `0x${string}`> = {
  534351: "0xfdEA8c139F282b14E09D27528a316c7e8AA27878", // Scroll Sepolia Testnet (chainId: 534351 )
};

const supportChains_alpha = [scrollSepolia];

// -------------------

// 主网----------------
const WETH_ADDR_release: Record<number, `0x${string}`> = {
  42766: "0xD33Db7EC50A98164cC865dfaa64666906d79319C",
};

const defaultWrapedTokenSymbol_release: Record<number, string> = {
  42766: "WUSDC",
};

const swapContractAddress_release: Record<number, `0x${string}`> = {
  42766: "0x90a6a815ADa96F682E6D91799F4682602021095c",
};

const supportChains_release = [
  defineChain({
    id: 42766,
    name: "ZKFair Mainnet",
    network: "ZKFair",
    nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
    rpcUrls: {
      default: {
        http: ["https://rpc.zkfair.io"],
      },
      public: {
        http: ["https://rpc.zkfair.io"],
      },
    },
    blockExplorers: {
      etherscan: {
        name: "ZKFair Explorer",
        url: "https://scan.zkfair.io/",
      },
      default: {
        name: "ZKFair Explorer",
        url: "https://scan.zkfair.io/",
      },
    },
    // contracts: {
    //   multicall3: {
    //     address: "0xca11bde05977b3631167028862be2a173976ca11",
    //     blockCreated: 4286263,
    //   },
    // },
  }),
];
// -------------------

// export const approveGasLimit = 30_000n; // test

export const gasLimit = 1_800_000n; // test @PRD

export const defaultSlippage = 3; // @PRD

// --------------------- 下面的一般不需要适配改动

export const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export const getWETHAddr = (chainId: number): `0x${string}` =>
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? WETH_ADDR_release[chainId]
    : WETH_ADDR_alpha[chainId];

export const swapContractAddress: Record<number, `0x${string}`> =
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? swapContractAddress_release
    : swapContractAddress_alpha;

export const getTokenList = (chainId: number): Currency[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allTokenList: Array<any> =
    process.env.NEXT_PUBLIC_BUILD_ENV === "release"
      ? require("@/assets/tokenList.json")
      : require("@/assets/tokenListDev.json");
  return allTokenList
    .filter((token) => token.chains?.includes(chainId))
    .map((token) => ({ ...token, ...token.contracts[`${chainId}`] }));
};

export const getDefaultWrapedTokenSymbol = (chainId: number): string =>
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? defaultWrapedTokenSymbol_release[chainId]
    : defaultWrapedTokenSymbol_alpha[chainId];

export const supportChains =
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? supportChains_release
    : supportChains_alpha;

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
