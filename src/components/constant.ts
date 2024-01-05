/* eslint-disable @typescript-eslint/no-var-requires */
import { scrollSepolia, zkFair } from "wagmi/chains";
import { Currency } from "./currencyMap";
import { SearchPathQueryParams } from "iziswap-sdk/lib/search/types";

type PickedSearchPathQueryParams = Pick<
  SearchPathQueryParams,
  | "liquidityManagerAddress"
  | "quoterAddress"
  | "supportFeeContractNumbers"
  | "midTokenList"
>;

interface MySearchPathQueryParams extends PickedSearchPathQueryParams {
  multicallAddress: `0x${string}`;
}

// 测试网-------------
const supportChains_alpha = [scrollSepolia];

const tokenList_alpha = require("@/assets/tokenListDev.json");

const WETH_ADDR_alpha: Record<number, `0x${string}`> = {
  [scrollSepolia.id]: "0xfa6a407c4c49ea1d46569c1a4bcf71c3437be54c",
};

const defaultWrapedTokenSymbol_alpha: Record<number, string> = {
  [scrollSepolia.id]: "WETH",
};

const swapContractAddress_alpha: Record<number, `0x${string}`> = {
  [scrollSepolia.id]: "0xfdEA8c139F282b14E09D27528a316c7e8AA27878", // Scroll Sepolia Testnet (chainId: 534351 )
};

const searchPathParams_alpha: Record<number, MySearchPathQueryParams> = {
  [scrollSepolia.id]: {
    multicallAddress: "0xcd19063466CE94a37615AbE9cBE6baA9C5759b1b",
    liquidityManagerAddress: "0x67A1f4A939b477A6b7c5BF94D97E45dE87E608eF",
    quoterAddress: "0xF6FFe4f3FdC8BBb7F70FFD48e61f17D1e343dDfD",
    supportFeeContractNumbers: [2000],
    midTokenList: [],
  },
};

// -------------------

// 主网----------------
const supportChains_release = [zkFair];

const tokenList_release = require("@/assets/tokenList.json");

const WETH_ADDR_release: Record<number, `0x${string}`> = {
  [zkFair.id]: "0xD33Db7EC50A98164cC865dfaa64666906d79319C",
};

const defaultWrapedTokenSymbol_release: Record<number, string> = {
  [zkFair.id]: "WUSDC",
};

const swapContractAddress_release: Record<number, `0x${string}`> = {
  [zkFair.id]: "0x90a6a815ADa96F682E6D91799F4682602021095c",
};

const searchPathParams_release: Record<number, MySearchPathQueryParams> = {
  [zkFair.id]: {
    multicallAddress: "0x7a524c7e82874226f0b51aade60a1be4d430cf0f",
    liquidityManagerAddress: "0x110dE362cc436D7f54210f96b8C7652C2617887D",
    quoterAddress: "0x3EF68D3f7664b2805D4E88381b64868a56f88bC4",
    supportFeeContractNumbers: [10_000, 3_000],
    midTokenList: [
      {
        chainId: zkFair.id,
        symbol: "WUSDC",
        address: "0xD33Db7EC50A98164cC865dfaa64666906d79319C",
        decimal: 18,
      },
      {
        chainId: zkFair.id,
        symbol: "ZKF",
        address: "0x1cd3e2a23c45a690a18ed93fd1412543f464158f",
        decimal: 18,
      },
    ],
  },
};

// -------------------

export const approveGasLimit = 50_000n;

export const gasLimit = 255_000n;

export const defaultSlippage = 3; // @PRD

// --------------------- 下面的一般不需要适配改动

export const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export const chainImages = {
  [zkFair.id]:
    "https://izumi-finance.oss-ap-southeast-1.aliyuncs.com/tokens/zkf.png",
};

export const supportChains =
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? supportChains_release
    : supportChains_alpha;

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
      ? tokenList_release
      : tokenList_alpha;
  return allTokenList
    .filter((token) => token.chains?.includes(chainId))
    .map((token) => ({ ...token, ...token.contracts[`${chainId}`] }));
};

export const getSearchPathParams = (chainId: number) =>
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? searchPathParams_release[chainId]
    : searchPathParams_alpha[chainId];

export const getDefaultWrapedTokenSymbol = (chainId: number): string =>
  process.env.NEXT_PUBLIC_BUILD_ENV === "release"
    ? defaultWrapedTokenSymbol_release[chainId]
    : defaultWrapedTokenSymbol_alpha[chainId];

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
