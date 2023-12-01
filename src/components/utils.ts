import { formatUnits } from "viem";

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
 * fee strategy
 * 1%
 */
export const getMinReceived = (originOutputValue: bigint, decimals: number) => {
  const value = (originOutputValue * 99n) / 100n;
  return {
    value,
    formated: getNFloatNumber(formatUnits(value, decimals), 5),
  };
};
