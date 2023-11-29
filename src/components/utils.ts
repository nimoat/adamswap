// 省略显示数字
export const getNFloatNumber = (number: string | number = 0, n = 3) => {
  const num = Number(number);
  if (!num) {
    return "0";
  }
  const fixed = num.toFixed(n);
  const precision = num.toPrecision(n);
  return fixed.length > precision.length ? fixed : precision;
};

export type PriceInfo = {
  is_success: boolean;
  data: Record<string, number>;
  is_idempotent: boolean;
  error_code?: string;
  error_msg?: string;
  total: number;
};
