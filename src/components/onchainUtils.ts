import Web3 from "web3";
import { ChainId, TokenInfoFormatted } from "iziswap-sdk/lib/base/types";
// import { BigNumber } from "bignumber.js";
import { getMulticallContracts } from "iziswap-sdk/lib/base";
import {
  // PoolPair,
  SearchPathQueryParams,
  SwapDirection,
} from "iziswap-sdk/lib/search/types";
import { searchPathQuery } from "iziswap-sdk/lib/search/func";

// const iZi = {
//   chainId: ChainId.BSCTestnet,
//   symbol: "iZi",
//   address: "0x60D01EC2D5E98Ac51C8B4cF84DfCCE98D527c747",
//   decimal: 18,
// };

// const support001Pools = [
//   {
//     tokenA: iUSD,
//     tokenB: USDT,
//     feeContractNumber: 100,
//   } as PoolPair,
//   {
//     tokenA: USDC,
//     tokenB: USDT,
//     feeContractNumber: 100,
//   } as PoolPair,
//   {
//     tokenA: USDC,
//     tokenB: iUSD,
//     feeContractNumber: 100,
//   } as PoolPair,
// ];

const rpc = "https://sepolia-rpc.scroll.io/";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const quoterAddress = "0xF6FFe4f3FdC8BBb7F70FFD48e61f17D1e343dDfD";
const multicallAddress = "0xcd19063466CE94a37615AbE9cBE6baA9C5759b1b"; // scroll testnet
const multicallContract = getMulticallContracts(multicallAddress, web3 as Web3);
const liquidityManagerAddress = "0x67A1f4A939b477A6b7c5BF94D97E45dE87E608eF"; // scroll testnet

const initialSearchParams: Omit<
  SearchPathQueryParams,
  "tokenIn" | "tokenOut" | "amount"
> = {
  chainId: Number(ChainId.ScrollTestL2),
  web3: web3,
  multicall: multicallContract,
  // tokenIn: BNB, // 参数替换
  // tokenOut: USDT, // 参数替换
  liquidityManagerAddress,
  quoterAddress,
  poolBlackList: [],
  midTokenList: [],
  supportFeeContractNumbers: [2000],
  support001Pools: [],
  direction: SwapDirection.ExactIn,
  // amount: "1000000", // 参数替换
};

// pathQueryResult stores optimized swap-path
//     and estimated swap-amount (output amount for exactIn, and input amount for exactOut)
// preQueryResult caches data of pools and their state (current point)
//     which will be used during path-searching
//     preQueryResult can be used for speed-up for next search
//     etc, if you want to speed up a little next search,
//     just use following code:
//     await searchPathQuery(searchParams, preQueryResult)
//     cached data in preQueryResult can be used for different
//     pair of <inputToken, outputToken> or different direction
//     but notice that, cached data in preQueryResult can not be
//     used in different chain
export const searchPath = async (
  tokenIn: TokenInfoFormatted,
  tokenOut: TokenInfoFormatted,
  amount: string
) => {
  const { pathQueryResult } = await searchPathQuery({
    ...initialSearchParams,
    tokenIn,
    tokenOut,
    amount,
  });
  return pathQueryResult;
};
