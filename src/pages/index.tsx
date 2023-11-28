import Head from "next/head";
import Image from "next/image";
import {
  erc20ABI,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
  useNetwork,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { fetchBalance } from "@wagmi/core";
import React, { useEffect, useMemo, useState } from "react";
import favicon from "@/assets/favicon.ico";
import logo from "@/assets/logo.svg";
import { Button } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import NumericInput from "@/components/NumericInput";
import currencyMap from "@/components/currencyMap";
import type { Currency, CurrencyV } from "@/components/currencyMap";
import { swapContractAddress, swapAbi } from "@/components/constant";
import { useDebounceFn } from "ahooks";
import { getTokenChainPath } from "iziswap-sdk/lib/base";
import { PathQueryResult } from "iziswap-sdk/lib/search/types";
import { searchPath } from "@/components/onchainUtils";
import { getNFloatNumber } from "@/components/utils";

import styles from "@/styles/Home.module.less";

type PriceInfo = {
  is_success: boolean;
  data: Record<string, number>;
  is_idempotent: boolean;
  error_code?: string;
  error_msg?: string;
  total: number;
};

export const getStaticProps = async () => {
  const res = await fetch(
    "https://api.izumi.finance/api/v1/token_info/price_info/?t=USDC&t=ETH&t=WETH&t=USDT&t=iZi&t=BUSD&t=WBNB&t=iUSD&t=WBNB&t=BNB"
  );
  const repo = await res.json();
  return { props: { priceInfo: repo } };
};

export default function Home(props: { priceInfo: PriceInfo }) {
  console.log({ props });
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const [fetchedCurrencyMap, setFetchedCurrencyMap] =
    useState<Record<string, Currency>>();

  const [swapPair, setSwapPair] = useState<[CurrencyV, CurrencyV]>([
    { ...currencyMap.ETH, value: 0n, formatted: "" },
    { value: 0n, formatted: "" },
  ]);
  const [searchPathInfo, setSearchPathInfo] = useState<PathQueryResult>();

  const { address: accountAddress, isConnected } = useAccount();
  const { chain: connectChain, chains } = useNetwork();

  useEffect(() => {
    if (isConnected && chains.some((item) => item.id === connectChain!.id)) {
      Promise.all(
        Object.entries(currencyMap).map(([key, map]) =>
          fetchBalance({
            address: accountAddress as `0x${string}`,
            token: map.address as `0x${string}`,
          }).then(({ decimals, symbol, formatted, value }) => [
            key,
            {
              ...map,
              decimals,
              symbol,
              banlanceFormatted: formatted,
              banlanceValue: value,
            },
          ])
        )
      ).then((res) => {
        const _fetchedCurrencyMap = Object.fromEntries(res);
        setFetchedCurrencyMap(_fetchedCurrencyMap);
        setSwapPair([
          { ..._fetchedCurrencyMap.ETH, value: 0n, formatted: "" },
          { value: 0n, formatted: "" },
        ]);
      });
    }
  }, [accountAddress, isConnected, connectChain, chains]);

  const isPrepared = useMemo(() => !!fetchedCurrencyMap, [fetchedCurrencyMap]);

  // console.log({ isPrepared, fetchedCurrencyMap });

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const onCurrencySelect = (currency: Currency, index: 0 | 1 = 0) => {
    if (currency.symbol === swapPair[1 - index].symbol) {
      setSwapPair((sp) => {
        return [sp[1], sp[0]];
      });
    } else {
      setSwapPair((sp) => {
        sp[index] = {
          ...currency,
          value: sp[index].value,
          formatted: sp[index].formatted,
        };
        return [...sp];
      });
    }
  };

  const onClickOrder = () => {
    setSwapPair((sp) => {
      return [sp[1], sp[0]];
    });
  };

  const onInputAmountChange = (v: string) => {
    setSwapPair((sp) => [
      {
        ...sp[0],
        value: parseUnits(v, sp[0].decimals!),
        formatted: v,
      },
      sp[1],
    ]);
    if (
      v &&
      v! == swapPair[0].formatted &&
      swapPair.every((sp) => !!sp.address)
    ) {
      debounceInputAmountChange(v);
    }
  };

  const { run: debounceInputAmountChange } = useDebounceFn(
    (value: string) => {
      searchPath(
        {
          address: swapPair[0].address!,
          symbol: swapPair[0].symbol!,
          chainId: connectChain!.id,
          decimal: 18,
        },
        {
          address: swapPair[1].address!,
          symbol: swapPair[1].symbol!,
          chainId: connectChain!.id,
          decimal: 18,
        },
        parseUnits(value, swapPair[0].decimals!).toString(),
        connectChain!
      ).then((res) => {
        setSearchPathInfo(res);
        if (res.amount) {
          const outputValue = formatUnits(
            BigInt(res.amount),
            swapPair[1].decimals!
          );
          setSwapPair((sp) => [
            sp[0],
            {
              ...sp[1],
              value: BigInt(res.amount),
              formatted: getNFloatNumber(outputValue, 5),
            },
          ]);
        }
      });
    },
    {
      wait: 500,
    }
  );

  // 获取erc20 allowance
  const { data: allowanceData, refetch } = useContractRead({
    abi: isPrepared ? erc20ABI : undefined,
    functionName: "allowance",
    address: swapPair[0].address as `0x${string}`,
    args: [accountAddress!, swapContractAddress],
  });

  // approve上链前
  const { data: approveData, write: approveWrites } = useContractWrite({
    abi: erc20ABI,
    functionName: "approve",
    address: swapPair[0].address as `0x${string}`,
    // onError: (error) => {
    //   console.log("Error", error);
    // },
  });

  // approve上链后
  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: async () => {
      const { data: allowance } = await refetch();
      if (allowance && allowance >= swapPair[0].value) {
        writeSwap();
      }
    },
  });

  // swap上链前
  const { isLoading, isSuccess, data, error, write } = useContractWrite({
    abi: swapAbi,
    functionName: "swapAmount",
    address: swapContractAddress,
    // onError: (error) => {
    //   console.log("Error", error);
    // },
    // onSuccess: (data) => {
    //   console.log("data", data.hash);
    // },
  });

  // swap上链后
  const {
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    error: error2,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  console.log({ isLoading, isSuccess, error, isLoading2, isSuccess2, error2 });

  const writeSwap = () => {
    write?.({
      args: [
        {
          path: getTokenChainPath(
            searchPathInfo!.path.tokenChain,
            searchPathInfo!.path.feeContractNumber
          ), //pathWithFee
          recipient: accountAddress,
          amount: swapPair[0]?.value,
          minAcquired: (BigInt(searchPathInfo!.amount) * 95n) / 100n,
          deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 10 分钟
        },
      ],
      // value: 0,
    });
  };

  const onClickSwap = () => {
    // 检查授权
    if (!allowanceData || allowanceData < swapPair[0].value) {
      approveWrites?.({
        args: [swapContractAddress, swapPair[0].value],
      });
    } else {
      writeSwap();
    }
  };

  return (
    <>
      <Head>
        <title>AdamSwap</title>
        <meta name="description" content="Generated by create-wc-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon.src} />
      </Head>
      <header>
        <div
          className={styles.backdrop}
          style={{
            opacity: isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
          }}
        />
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image src={logo.src} alt="EasySwap" height="32" width="203" />
          </div>
          <div className={styles.buttons}>
            <div
              onClick={closeAll}
              className={`${styles.highlight} ${
                isNetworkSwitchHighlighted ? styles.highlightSelected : ``
              }`}
            >
              <w3m-network-button />
            </div>
            <div
              onClick={closeAll}
              className={`${styles.highlight} ${
                isConnectHighlighted ? styles.highlightSelected : ``
              }`}
            >
              <w3m-button />
            </div>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.title}>Swap</div>
            <NumericInput
              currencyMap={fetchedCurrencyMap}
              tip="Pay"
              index={0}
              swapPair={swapPair}
              onSelect={(e) => onCurrencySelect(e, 0)}
              onChange={onInputAmountChange}
            />
            <div className={styles.divide}>
              <div className={styles.swapIcon} onClick={onClickOrder}>
                <SwapOutlined />
              </div>
            </div>
            <NumericInput
              currencyMap={fetchedCurrencyMap}
              tip="Receive"
              index={1}
              swapPair={swapPair}
              onSelect={(e) => onCurrencySelect(e, 1)}
              onChange={(v) =>
                setSwapPair((sp) => [
                  sp[0],
                  {
                    ...sp[1],
                    value: parseUnits(v, sp[1].decimals!),
                    formatted: v,
                  },
                ])
              }
            />
            <Button
              className="swap-primary-btn"
              type="primary"
              size="large"
              disabled={swapPair.some((sp) => !sp.symbol || !sp.formatted)}
              onClick={onClickSwap}
            >
              {swapPair.some((sp) => !sp.symbol) ? "Select a token" : "Swap"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
