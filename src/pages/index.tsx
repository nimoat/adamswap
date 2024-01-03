import Image from "next/image";
import { useAccount, useNetwork } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { fetchBalance, fetchFeeData, FetchFeeDataResult } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useEffect, useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import { Button, ButtonProps, Popconfirm, notification } from "antd";
import {
  SwapOutlined,
  WarningOutlined,
  SettingFilled,
} from "@ant-design/icons";
import NumericInput from "@/components/NumericInput";
import type { Currency, CurrencyV } from "@/components/currencyMap";
import PreviewPanel from "@/components/PreviewPanel";
import { useDebounceFn } from "ahooks";
import { PathQueryResult } from "iziswap-sdk/lib/search/types";
import { searchPath } from "@/components/onchainUtils";
import { PriceInfo, getNFloatNumber } from "@/components/utils";
import { SwapPair, SwapType } from "@/components/context";
import ConfirmModal, {
  getSwapInfoMap,
  SwapTypeEnum,
} from "@/components/ConfirmModal";
import UserSetting from "@/components/UserSetting";
import {
  defaultSlippage,
  getDefaultTokenSymbol,
  getTokenList,
  getWETHAddr,
} from "@/components/constant";

import styles from "@/styles/Home.module.less";

const WETH_SYMBOL = "WETH";
const ETH_SYMBOL = "ETH";

export const client_getStaticProps = async (chainId: number) => {
  const tokenList = getTokenList(chainId);
  const params = tokenList.reduce((pre: URLSearchParams, cur: Currency) => {
    pre.append("t", cur.symbol!);
    return pre;
  }, new URLSearchParams());
  const res = await fetch(
    `https://api.izumi.finance/api/v1/token_info/price_info/?${params.toString()}`
  );
  const repo = await res.json();
  return { props: { _priceInfo: repo } };
};

export default function Home() {
  // const { _priceInfo } = props;
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const [fetchedCurrencyMap, setFetchedCurrencyMap] =
    useState<Record<string, Currency>>();
  const [swapPair, setSwapPair] = useState<[CurrencyV, CurrencyV]>([
    { value: 0n, formatted: "" },
    { value: 0n, formatted: "" },
  ]);
  const [searchPathInfo, setSearchPathInfo] = useState<PathQueryResult>();
  const [feeData, setFeeData] = useState<FetchFeeDataResult | undefined>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [slippage, setSlippage] = useState<number | null>(defaultSlippage);
  const [priceInfo, setPriceInfo] = useState<PriceInfo>();

  const { address: accountAddress, isConnected } = useAccount();
  const { chain: connectChain, chains } = useNetwork();
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal();
  const [notify, contextHolder] = notification.useNotification();

  const isCorrectChain = useMemo(
    () => connectChain && chains.some((item) => item.id === connectChain.id),
    [connectChain, chains]
  );

  const swapType = useMemo(() => {
    if (swapPair.every((sp) => !!sp.symbol)) {
      if (swapPair[0].symbol === ETH_SYMBOL) {
        if (swapPair[1].symbol === WETH_SYMBOL) {
          return SwapTypeEnum.wrap;
        }
        return SwapTypeEnum.eth4Erc20;
      }
      if (swapPair[1].symbol === ETH_SYMBOL) {
        if (swapPair[0].symbol === WETH_SYMBOL) {
          return SwapTypeEnum.unWrap;
        }
        return SwapTypeEnum.erc204Eth;
      }
      return SwapTypeEnum.erc204Erc20;
    }
  }, [swapPair]);

  const tokenList = useMemo(() => {
    if (connectChain?.id) {
      return getTokenList(connectChain.id);
    }
    return [];
  }, [connectChain]);

  const fetchAllBalance = () => {
    Promise.all(
      tokenList.map((token) =>
        fetchBalance({
          address: accountAddress as `0x${string}`,
          token:
            token.symbol === getDefaultTokenSymbol(connectChain!.id)
              ? undefined
              : (token.address as `0x${string}`),
        }).then(({ decimals, symbol, formatted, value }) => [
          token.symbol,
          {
            ...token,
            dedecimal: decimals,
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
        {
          ..._fetchedCurrencyMap[getDefaultTokenSymbol(connectChain!.id)],
          address: undefined,
          value: 0n,
          formatted: "",
        },
        { value: 0n, formatted: "" },
      ]);
    });
  };

  // 仅客户端渲染时需要
  useEffect(() => {
    if (connectChain?.id) {
      client_getStaticProps(connectChain.id).then((res) =>
        setPriceInfo(res.props._priceInfo)
      );
    }
  }, [connectChain]);

  useEffect(() => {
    if (isConnected && isCorrectChain) {
      fetchAllBalance();
      setSwapPair([
        {
          ...tokenList.find(
            (token) => token.symbol === getDefaultTokenSymbol(connectChain!.id)
          ),
          value: 0n,
          formatted: "",
        },
        { value: 0n, formatted: "" },
      ]);
    } else {
      setFetchedCurrencyMap(undefined);
      setSwapPair([
        { value: 0n, formatted: "" },
        { value: 0n, formatted: "" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, isConnected, connectChain, chains]);

  const isPrepared = useMemo(() => !!fetchedCurrencyMap, [fetchedCurrencyMap]);

  useEffect(() => {
    if (isCorrectChain) {
      closeWeb3Modal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrectChain]);

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

    if (
      currency.symbol &&
      swapPair[1 - index].symbol &&
      swapPair[0].formatted &&
      swapPair[0].value
    ) {
      debounceInputAmountChange(swapPair[0].formatted);
    }
  };

  const onClickOrder = () => {
    if (swapPair.some((item) => !item.symbol)) {
      return;
    }

    setSwapPair((sp) => {
      return [
        { ...sp[1], value: 0n, formatted: "" },
        { ...sp[0], value: 0n, formatted: "" },
      ];
    });
  };

  const onInputAmountChange = (v: string) => {
    const value = parseUnits(v, swapPair[0].decimal!);
    setSwapPair((sp) => [
      {
        ...sp[0],
        value,
        formatted: v,
      },
      sp[1],
    ]);

    if (
      v &&
      v !== swapPair[0].formatted &&
      value &&
      swapPair.every((sp) => !!sp.symbol)
    ) {
      // value 保证输入格式正确
      debounceInputAmountChange(v);
    }
  };

  const { run: debounceInputAmountChange } = useDebounceFn(
    (value: string) => {
      const bnValue = parseUnits(value, swapPair[0].decimal!);
      if ([SwapTypeEnum.unWrap, SwapTypeEnum.wrap].includes(swapType!)) {
        // ETH/WETH
        setSwapPair((sp) => [
          sp[0],
          {
            ...sp[1],
            value: bnValue,
            formatted: formatUnits(bnValue, sp[1].decimal!),
          },
        ]);
      } else {
        searchPath(
          {
            address: swapPair[0].address ?? getWETHAddr(connectChain!.id),
            symbol: swapPair[0].address ? swapPair[0].symbol! : WETH_SYMBOL,
            chainId: connectChain!.id,
            decimal: 18,
          },
          {
            address: swapPair[1].address ?? getWETHAddr(connectChain!.id),
            symbol: swapPair[1].address ? swapPair[1].symbol! : WETH_SYMBOL,
            chainId: connectChain!.id,
            decimal: 18,
          },
          bnValue.toString(),
          connectChain!
        ).then((res) => {
          setSearchPathInfo(res);
          if (res.amount) {
            const outputValue = formatUnits(
              BigInt(res.amount),
              swapPair[1].decimal!
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
      }

      // 实时gas
      fetchFeeData().then((fee) => {
        setFeeData({
          ...fee,
          gasPrice: fee.gasPrice ? (fee.gasPrice * 105n) / 100n : null,
        });
      });
    },
    {
      wait: 500,
    }
  );

  const mainButton = useMemo(() => {
    const btnProps: ButtonProps = {
      className: styles["swap-primary-btn"],
      type: "primary",
      size: "large",
    };
    if (!isConnected) {
      return (
        <Button
          {...btnProps}
          onClick={() => openWeb3Modal({ view: "Connect" })}
        >
          Connect Wallet
        </Button>
      );
    }
    if (!isCorrectChain) {
      return (
        <Button
          {...btnProps}
          onClick={() => openWeb3Modal({ view: "Networks" })}
        >
          Connect to {chains[0].name}
        </Button>
      );
    }
    if (swapPair.some((sp) => !sp.symbol)) {
      return (
        <Button {...btnProps} disabled>
          Select a token
        </Button>
      );
    }
    if (swapPair.some((sp) => !sp.formatted || !sp.value)) {
      return (
        <Button {...btnProps} disabled>
          Enter an amount
        </Button>
      );
    }
    if (isPrepared && swapPair[0].value > swapPair[0].banlanceValue!) {
      return (
        <Button {...btnProps} disabled>
          Insufficient {swapPair[0].symbol} balance
        </Button>
      );
    }
    return (
      <Button {...btnProps} onClick={() => setIsConfirmModalOpen(true)}>
        {getSwapInfoMap(connectChain!.id)[swapType!].label}
      </Button>
    );
  }, [
    isConnected,
    isCorrectChain,
    isPrepared,
    connectChain,
    chains,
    swapPair,
    swapType,
    openWeb3Modal,
  ]);

  return (
    <SwapPair.Provider value={swapPair}>
      <SwapType.Provider value={swapType}>
        <header>
          <div
            className={styles.backdrop}
            style={{
              opacity:
                isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
            }}
          />
          <div className={styles.header}>
            <div className={styles.logo}>
              <Image src={logo.src} alt="EasySwap" height="40" width="40" />
              <div className={styles.logoName}>EasySwap</div>
            </div>
            <div className={styles.buttons}>
              <div
                onClick={closeAll}
                className={`${styles.highlight} ${
                  isNetworkSwitchHighlighted ? styles.highlightSelected : ``
                }`}
              >
                {isCorrectChain || !isConnected ? (
                  <w3m-network-button />
                ) : (
                  <Button
                    type="text"
                    danger
                    icon={<WarningOutlined />}
                    onClick={() => openWeb3Modal({ view: "Networks" })}
                  >
                    Wrong Network
                  </Button>
                )}
              </div>
              <div
                onClick={closeAll}
                className={`${styles.highlight} ${
                  isConnectHighlighted ? styles.highlightSelected : ``
                }`}
              >
                <w3m-button balance="hide" />
              </div>
            </div>
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.title}>
                <span className={styles.titleText}>Swap</span>
                {(isPrepared || true) && (
                  <Popconfirm
                    rootClassName={styles.settingPopover}
                    placement="bottomRight"
                    title={null}
                    icon={null}
                    description={
                      <UserSetting
                        slippage={slippage}
                        setSlippage={setSlippage}
                      />
                    }
                  >
                    <Button
                      className={styles.settingBtn}
                      icon={<SettingFilled />}
                      type="text"
                    >
                      <span className="slippage">{slippage}% slippage</span>
                    </Button>
                  </Popconfirm>
                )}
              </div>
              <NumericInput
                currencyMap={fetchedCurrencyMap}
                tip="Pay"
                index={0}
                priceInfo={priceInfo!}
                disabled={!isPrepared}
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
                priceInfo={priceInfo!}
                disabled={!isPrepared}
                onSelect={(e) => onCurrencySelect(e, 1)}
              />
              {swapPair[0].value && swapPair[1].value ? (
                <PreviewPanel
                  searchPathInfo={searchPathInfo!}
                  feeData={feeData}
                  priceInfo={priceInfo!}
                  slippage={slippage}
                />
              ) : (
                <></>
              )}
              {mainButton}
            </div>
          </div>
        </main>
        {swapPair.every((sp) => !!sp.symbol) && (
          <ConfirmModal
            isModalOpen={isConfirmModalOpen}
            priceInfo={priceInfo!}
            searchPathInfo={searchPathInfo!}
            feeData={feeData}
            slippage={slippage}
            notify={notify}
            setConfirmModalOpen={setIsConfirmModalOpen}
            onSuccess={() => fetchAllBalance()}
          />
        )}
        {contextHolder}
      </SwapType.Provider>
    </SwapPair.Provider>
  );
}
