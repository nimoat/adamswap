import { createContext } from "react";
import currencyMap from "@/components/currencyMap";
import type { CurrencyV } from "@/components/currencyMap";
import { SwapTypeEnum } from "./ConfirmModal";

export const SwapPair = createContext<[CurrencyV, CurrencyV]>([
  { ...currencyMap.ETH, value: 0n, formatted: "" },
  { value: 0n, formatted: "" },
]);

export const SwapType = createContext<SwapTypeEnum | undefined>(undefined);
