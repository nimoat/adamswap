import ETH from "../assets/currencyLogo/ETH.png";
import WETH from "../assets/currencyLogo/WETH.png";
import USDT from "../assets/currencyLogo/USDT.png";
import IZI from "../assets/currencyLogo/IZI.svg";
// import DAI from "../assets/currencyLogo/DAI.png";
// import WBTC from "../assets/currencyLogo/WBTC.png";
// import LINK from "../assets/currencyLogo/LINK.png";
// import AAVE from "../assets/currencyLogo/AAVE.png";
// import LUSD from "../assets/currencyLogo/LUSD.png";
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

const currencyMap: Record<string, Currency> = {
  ETH: {
    name: "Ether",
    logoSrc: ETH.src,
    // address: ERC20Addrs.ETH_ADDR,
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
  iZi: {
    name: "iZUMi Token",
    logoSrc: IZI.src,
    address: ERC20Addrs.IZI_ADDR,
  },
  // USDC: {
  //   name: "Bridged USDC",
  //   logoSrc: USDC.src,
  //   symbol: "USDC",
  //   decimal: 18,
  // },
  // DAI: {
  //   name: "Dai Stablecoin",
  //   logoSrc: DAI.src,
  //   symbol: "DAI",
  // },
  // WBTC: {
  //   name: "Wrapped BTC",
  //   logoSrc: WBTC.src,
  //   symbol: "WBTC",
  // },
  // LINK: {
  //   name: "ChainLink Token",
  //   logoSrc: LINK.src,
  //   symbol: "LINK",
  // },
  // AAVE: {
  //   name: "Aave",
  //   logoSrc: AAVE.src,
  //   symbol: "AAVE",
  // },
  // LUSD: {
  //   name: "Liquity USD",
  //   logoSrc: LUSD.src,
  //   symbol: "LUSD",
  // },
};

export default currencyMap;
