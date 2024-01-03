import { createContext } from "react";
import type { CurrencyV } from "@/components/currencyMap";
import { SwapTypeEnum } from "./ConfirmModal";

export const SwapPair = createContext<[CurrencyV, CurrencyV]>([
  { value: 0n, formatted: "" },
  { value: 0n, formatted: "" },
]);

export const SwapType = createContext<SwapTypeEnum | undefined>(undefined);
