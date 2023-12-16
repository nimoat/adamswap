import { formatEther, formatUnits } from "viem";

// 省略显示数字
export const getNFloatNumber = (number: string | number = 0, n = 3) => {
  const num = Number(number);
  if (!num) {
    return "0";
  }
  const fixed = num.toFixed(n);
  const precision = num.toPrecision(n);
  const suitable = fixed.length > precision.length ? fixed : precision;
  const regexp = /(?:\.0*|(\.\d+?)0+)$/; // 去除多余的0
  return suitable.replace(regexp, "$1");
};

export type PriceInfo = {
  is_success: boolean;
  data: Record<string, number>;
  is_idempotent: boolean;
  error_code?: string;
  error_msg?: string;
  total: number;
};

/**
 * default slippage 0.5
 * myfee strategy 988 / 1000
 */
export const getMinReceived = (
  originOutputValue: bigint,
  decimals: number,
  slippage = 0,
  isMyFee = false
) => {
  let value = (originOutputValue * getSlippageBigint(slippage)) / 1000_000n;
  if (isMyFee) {
    value = (value * 988n) / 1000n;
  }
  return {
    value,
    formated: getNFloatNumber(formatUnits(value, decimals), 5),
  };
};

export const getNetworkFee = (
  gasPrice: bigint,
  gasLimit: bigint,
  priceInfo: PriceInfo
) =>
  "$" +
  getNFloatNumber(
    Number(formatEther(gasPrice * gasLimit)) * priceInfo.data.ETH
  );

/** 使用时需要除以1000_000n (6个0) */
export const getSlippageBigint = (v: number) => {
  return BigInt((100 - v) * 10000);
};
