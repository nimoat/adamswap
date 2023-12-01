import { createContext } from "react";
import currencyMap from "@/components/currencyMap";
import type { CurrencyV } from "@/components/currencyMap";

export const SwapPair = createContext<[CurrencyV, CurrencyV]>([
  { ...currencyMap.ETH, value: 0n, formatted: "" },
  { value: 0n, formatted: "" },
]);
