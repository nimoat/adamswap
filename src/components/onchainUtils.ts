import Web3 from "web3";
import { TokenInfoFormatted } from "iziswap-sdk/lib/base/types";
// import { BigNumber } from "bignumber.js";
import { getMulticallContracts } from "iziswap-sdk/lib/base";
import {
  // PoolPair,
  SearchPathQueryParams,
  SwapDirection,
} from "iziswap-sdk/lib/search/types";
import { searchPathQuery } from "iziswap-sdk/lib/search/func";
import type { Chain } from "viem";

const quoterAddress = "0xF6FFe4f3FdC8BBb7F70FFD48e61f17D1e343dDfD";
const multicallAddress = "0xcd19063466CE94a37615AbE9cBE6baA9C5759b1b"; // scroll testnet
const liquidityManagerAddress = "0x67A1f4A939b477A6b7c5BF94D97E45dE87E608eF"; // scroll testnet

const initialSearchParams: Omit<
  SearchPathQueryParams,
  "chainId" | "web3" | "multicall" | "tokenIn" | "tokenOut" | "amount"
> = {
  // chainId: Number(ChainId.ScrollTestL2),
  // web3: web3,
  // multicall: multicallContract,
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

/**
  @pathQueryResult stores optimized swap-path
      and estimated swap-amount (output amount for exactIn, and input amount for exactOut)
  @preQueryResult caches data of pools and their state (current point)
      which will be used during path-searching
      preQueryResult can be used for speed-up for next search
      etc, if you want to speed up a little next search,
      just use following code:
      await searchPathQuery(searchParams, preQueryResult)
      cached data in preQueryResult can be used for different
      pair of <inputToken, outputToken> or different direction
      but notice that, cached data in preQueryResult can not be
      used in different chain
*/
export const searchPath = async (
  tokenIn: TokenInfoFormatted,
  tokenOut: TokenInfoFormatted,
  amount: string,
  chain: Chain
) => {
  const rpc = chain.rpcUrls.default.http[0];
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const multicallContract = getMulticallContracts(
    multicallAddress,
    web3 as Web3
  );

  const { pathQueryResult } = await searchPathQuery({
    ...initialSearchParams,
    chainId: chain.id,
    web3,
    multicall: multicallContract,
    tokenIn,
    tokenOut,
    amount,
  });
  return pathQueryResult;
};
