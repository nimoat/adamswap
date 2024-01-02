import ETH from "../assets/currencyLogo/ETH.png";
import WETH from "../assets/currencyLogo/WETH.png";
import USDT from "../assets/currencyLogo/USDT.png";
import { ERC20Addrs } from "./constant";

export type Currency = {
  name: string;
  logoSrc: string;
  address?: string;
  symbol?: string;
  decimals?: number;
  banlanceValue?: bigint;
  banlanceFormatted?: string;
};

export interface CurrencyV extends Partial<Currency> {
  value: bigint;
  formatted: string;
}

// export const getCurrencyMap = (chainId: number) => {};

const currencyMap: Record<string, Currency> = {
  ETH: {
    name: "Ether",
    logoSrc: ETH.src,
  },
  WETH: {
    name: "Wrapped Ether",
    logoSrc: WETH.src,
    address: ERC20Addrs.WETH_ADDR,
  },
  USDT: {
    name: "Tether USD",
    logoSrc: USDT.src,
    address: ERC20Addrs.USDT_ADDR,
  },
};

export default currencyMap;
