import ETH from "../assets/currencyLogo/ETH.png";
import USDC from "../assets/currencyLogo/USDC.png";
import WETH from "../assets/currencyLogo/WETH.png";
import USDT from "../assets/currencyLogo/USDT.png";
import DAI from "../assets/currencyLogo/DAI.png";
import WBTC from "../assets/currencyLogo/WBTC.png";
import LINK from "../assets/currencyLogo/LINK.png";
import AAVE from "../assets/currencyLogo/AAVE.png";
import LUSD from "../assets/currencyLogo/LUSD.png";
import { zksERC20Addrs } from "./abi";

export type Currency = {
  name: string;
  logoSrc: string;
  symbol: string;
  address?: string;
};

export interface CurrencyV extends Partial<Currency> {
  value: string;
}

const currencyMap = {
  ETH: {
    name: "Ether",
    logoSrc: ETH.src,
    symbol: "ETH",
    address: zksERC20Addrs.ETH_ADDR,
  },
  WETH: {
    name: "Wrapped Ether",
    logoSrc: WETH.src,
    symbol: "WETH",
    address: zksERC20Addrs.WETH_ADDR,
  },
  USDC: {
    name: "Bridged USDC",
    logoSrc: USDC.src,
    symbol: "USDC",
    address: zksERC20Addrs.USDC_ADDR,
  },
  USDT: {
    name: "Tether USD",
    logoSrc: USDT.src,
    symbol: "USDT",
  },
  DAI: {
    name: "Dai Stablecoin",
    logoSrc: DAI.src,
    symbol: "DAI",
  },
  WBTC: {
    name: "Wrapped BTC",
    logoSrc: WBTC.src,
    symbol: "WBTC",
  },
  LINK: {
    name: "ChainLink Token",
    logoSrc: LINK.src,
    symbol: "LINK",
  },
  AAVE: {
    name: "Aave",
    logoSrc: AAVE.src,
    symbol: "AAVE",
  },
  LUSD: {
    name: "Liquity USD",
    logoSrc: LUSD.src,
    symbol: "LUSD",
  },
};

export default currencyMap;
