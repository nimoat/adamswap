import React, { useCallback, useContext, useMemo, useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button, Modal, Descriptions, Divider } from "antd";
import { LoadingOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { FetchFeeDataResult } from "@wagmi/core";
// import { parseGwei } from "viem";
import {
  erc20ABI,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
  useNetwork,
} from "wagmi";
import Steps from "./Steps";
import { getTokenChainPath } from "iziswap-sdk/lib/base";
import { SwapPair, SwapType } from "./context";
import {
  swapContractAddress,
  getWETHAddr,
  ZERO_ADDR,
  swapAbi,
  gasLimit,
  weth9Abi,
} from "./constant";
import {
  PriceInfo,
  getMinReceived,
  getNFloatNumber,
  getNetworkFee,
} from "./utils";
import { PathQueryResult } from "iziswap-sdk/lib/search/types";
import Rate from "./Rate";
import { useSwapWrite } from "./useSwapWrite";
import { NotificationInstance } from "antd/es/notification/interface";

import homeStyles from "@/styles/Home.module.less";
import styles from "@/styles/ConfirmModal.module.less";

export enum SwapTypeEnum {
  "erc204Erc20",
  "erc204Eth",
  "eth4Erc20",
  "wrap",
  "unWrap",
}

type SwapInfo = {
  label: "Swap" | "Wrap" | "Unwrap";
  functionName: Array<
    | "swapAmount"
    | "multicall"
    | "unwrapWETH9"
    | "refundETH"
    | "deposit"
    | "withdraw"
  >;
  abi: Array<unknown>;
  contractAddress: `0x${string}`;
};

export const getSwapInfoMap = (
  chainId: number
): Record<SwapTypeEnum, SwapInfo> => ({
  [SwapTypeEnum.erc204Erc20]: {
    label: "Swap",
    functionName: ["swapAmount"],
    abi: swapAbi,
    contractAddress: swapContractAddress[chainId],
  },
  [SwapTypeEnum.erc204Eth]: {
    label: "Swap",
    functionName: ["multicall", "swapAmount", "unwrapWETH9"],
    abi: swapAbi,
    contractAddress: swapContractAddress[chainId],
  },
  [SwapTypeEnum.eth4Erc20]: {
    label: "Swap",
    functionName: ["multicall", "swapAmount", "refundETH"],
    abi: swapAbi,
    contractAddress: swapContractAddress[chainId],
  },
  [SwapTypeEnum.wrap]: {
    label: "Wrap",
    functionName: ["deposit"],
    abi: weth9Abi,
    contractAddress: getWETHAddr(chainId),
  },
  [SwapTypeEnum.unWrap]: {
    label: "Unwrap",
    functionName: ["withdraw"],
    abi: weth9Abi,
    contractAddress: getWETHAddr(chainId),
  },
});

type ConfirmModalPropsType = {
  isModalOpen: boolean;
  priceInfo: PriceInfo;
  searchPathInfo: PathQueryResult;
  feeData: FetchFeeDataResult | undefined;
  slippage: number | null;
  notify: NotificationInstance;
  setConfirmModalOpen: (v: boolean) => void;
  onSuccess: () => void;
};

function ConfirmModal(props: ConfirmModalPropsType) {
  const {
    isModalOpen,
    priceInfo,
    searchPathInfo,
    feeData,
    slippage,
    notify,
    setConfirmModalOpen,
    onSuccess,
  } = props;

  const swapPair = useContext(SwapPair);
  const swapType = useContext(SwapType) as SwapTypeEnum;

  const [needApprove, setNeedApprove] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { address: accountAddress } = useAccount();
  const { chain: connectChain } = useNetwork();

  const swapPairPlus = useMemo(() => {
    return swapPair.map((item, index) => ({
      ...item,
      tip: index === 0 ? "You pay" : "You receive",
      valueInUSD:
        item?.symbol &&
        item?.formatted &&
        priceInfo.data[item.symbol] &&
        getNFloatNumber(Number(item.formatted) * priceInfo.data[item.symbol]),
    }));
  }, [swapPair, priceInfo]);

  const networkFee = feeData?.gasPrice
    ? getNetworkFee(feeData.gasPrice, gasLimit, priceInfo)
    : "";

  // 获取erc20 allowance
  const { data: allowanceData, refetch } = useContractRead({
    abi: erc20ABI,
    functionName: "allowance",
    address: swapPair[0].address as `0x${string}`,
    args: [accountAddress!, swapContractAddress[connectChain!.id]],
  });

  // approve上链前
  const { data: approveData, write: approveWrites } = useContractWrite({
    abi: erc20ABI,
    functionName: "approve",
    address: swapPair[0].address as `0x${string}`,
    // gas: approveGasLimit,
    // gasPrice: parseGwei("0.1"), //  feeData?.gasPrice ?? undefined, // @TODO: Legacy Transactions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: Error | any) => {
      notify.error({
        message: "Error",
        description: error.shortMessage,
        placement: "bottomRight",
      });
      setIsApproving(false);
      setConfirmModalOpen(true);
    },
  });

  // approve上链后
  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: async () => {
      const { data: allowance } = await refetch();
      setIsApproving(false);
      notify.success({
        message: `Approved ${swapPair[0].symbol}`,
        placement: "bottomRight",
      });
      if (allowance && allowance >= swapPair[0].value) {
        writeSwap();
      } else {
        setConfirmModalOpen(true);
      }
    },
    onError: (error) => {
      notify.error({
        message: `Approve failed!`,
        description: error.message,
        placement: "bottomRight",
      });
      setIsApproving(false);
      setConfirmModalOpen(true);
    },
  });

  const { data, write } = useSwapWrite({
    onError: (error) => {
      notify.error({
        message: "Error",
        description: error.shortMessage,
        placement: "bottomRight",
      });
      setIsSwapping(false);
      setConfirmModalOpen(true);
    },
  });

  // swap上链后
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async (data) => {
      setIsSwapping(false);
      notify.success({
        message: `${getSwapInfoMap(connectChain!.id)[swapType].label} success!`,
        description: (
          <Button
            type="link"
            target="_blank"
            style={{ padding: 0 }}
            href={`https://sepolia.scrollscan.com/tx/${data.transactionHash}`}
          >
            View on Explorer
          </Button>
        ),
        placement: "bottomRight",
      });
      onSuccess();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: Error | any) => {
      notify.error({
        message: `${getSwapInfoMap(connectChain!.id)[swapType].label} failed!`,
        description: error.shortMessage,
        placement: "bottomRight",
      });
      setIsSwapping(false);
      setConfirmModalOpen(true);
    },
  });

  const writeSwap = useCallback(() => {
    setIsSwapping(true);
    setConfirmModalOpen(false);
    const args =
      swapType === SwapTypeEnum.wrap
        ? []
        : swapType === SwapTypeEnum.unWrap
        ? [[swapPair[0]?.value]]
        : [
            [
              getTokenChainPath(
                searchPathInfo!.path.tokenChain,
                searchPathInfo!.path.feeContractNumber
              ), //pathWithFee
              swapType === SwapTypeEnum.erc204Eth ? ZERO_ADDR : accountAddress,
              swapPair[0]?.value,
              getMinReceived(
                swapPair[1].value,
                swapPair[1].decimal!,
                slippage ?? 0,
                false
              ).value,
              Math.floor(Date.now() / 1000) + 60 * 10, // 10 分钟
            ],
          ];
    write?.({
      args,
      value: swapPair[0].address ? 0n : swapPair[0].value,
    });
  }, [
    accountAddress,
    searchPathInfo,
    swapPair,
    swapType,
    slippage,
    write,
    setConfirmModalOpen,
  ]);

  const onConfirmSwap = useCallback(() => {
    // 检查授权
    if (
      (!allowanceData || allowanceData < swapPair[0].value) &&
      swapPair[0].address &&
      ![SwapTypeEnum.wrap, SwapTypeEnum.unWrap].includes(swapType)
    ) {
      approveWrites?.({
        args: [swapContractAddress[connectChain!.id], swapPair[0].value],
      });
      setIsApproving(true);
      setNeedApprove(true);
      setConfirmModalOpen(false);
    } else {
      setNeedApprove(false);
      writeSwap();
    }
  }, [
    allowanceData,
    swapPair,
    swapType,
    connectChain,
    approveWrites,
    writeSwap,
    setConfirmModalOpen,
  ]);

  const steps = useMemo(() => {
    return [
      { active: isApproving, key: 0 },
      { active: isSwapping, key: 1 },
    ];
  }, [isApproving, isSwapping]);

  return (
    <>
      <Modal
        title="Review swap"
        forceRender
        wrapClassName={styles["review-modal"]}
        centered
        open={isModalOpen}
        footer={
          <Button
            className={homeStyles["swap-primary-btn"]}
            type="primary"
            size="large"
            onClick={() => onConfirmSwap()}
          >
            Confirm swap
          </Button>
        }
        onCancel={() => setConfirmModalOpen(false)}
      >
        <div className="swap-pair">
          {swapPairPlus.map((item) => (
            <div className="pair-item" key={item.tip}>
              <div className="tip">{item.tip}</div>
              <div className="center">
                <div className="value">
                  {item.formatted} {item.symbol}
                </div>
                <div className="symbol">
                  {item.icon && (
                    <Image
                      src={item.icon}
                      alt="Currency Logo"
                      height="32"
                      width="32"
                    />
                  )}
                </div>
              </div>
              <div className="bottom">
                <div className="bottom-left">
                  {item.valueInUSD ? "$" + item.valueInUSD : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className="swap-preview-info">
          <Descriptions
            className={homeStyles["swap-descriptions"]}
            column={1}
            colon={false}
            items={[
              {
                key: 0,
                label: "Rate",
                children: <Rate />,
              },
              {
                key: 1,
                label: "Price imapct",
                children: `~${getNFloatNumber(
                  (searchPathInfo?.priceImpact ?? 0) * 100,
                  2
                )}%`,
              },
              { key: 2, label: "Max. slippage", children: `${slippage}%` },
              {
                key: 3,
                label: "Min. received",
                children: `${
                  [SwapTypeEnum.wrap, SwapTypeEnum.unWrap].includes(swapType!)
                    ? swapPair[1].formatted
                    : getMinReceived(
                        swapPair[1].value,
                        swapPair[1].decimal!,
                        slippage ?? 0,
                        true
                      ).formated
                } ${swapPair[1].symbol}`,
              },
              {
                key: 4,
                label: "Network fee",
                children: networkFee,
              },
              // {
              //   key: 5,
              //   label: "Route",
              //   children: <Button type="link">View</Button>,
              // },
            ]}
          />
        </div>
      </Modal>

      <Modal
        title={
          <div className={homeStyles.logo}>
            <Image src={logo.src} alt="EasySwap" height="30" width="30" />
            <div className={homeStyles.logoName} style={{ fontSize: 18 }}>
              EasySwap
            </div>
          </div>
        }
        wrapClassName={styles["steps-modal"]}
        centered
        forceRender
        maskClosable={false}
        open={isApproving || isSwapping}
        footer={needApprove ? <Steps items={steps} /> : null}
        onCancel={() => {
          setIsApproving(false);
          setIsSwapping(false);
          setConfirmModalOpen(true);
        }}
      >
        {isApproving && (
          <>
            <Image
              src={swapPair[0].icon!}
              alt="Currency Logo"
              height="36"
              width="36"
            />
            <p>Enable spending {swapPair[0].symbol} on EasySwap</p>
          </>
        )}
        <LoadingOutlined />
        {isSwapping && (
          <div className="swap-confirm-info">
            <p>Confirm swap</p>
            <div className="pair-confirm">
              <div className="pair-item">
                <div className="symbol">
                  <Image
                    src={swapPair[0].icon!}
                    alt="Currency Logo"
                    height="16"
                    width="16"
                  />
                </div>
                <div className="value">
                  {swapPair[0].formatted} {swapPair[0].symbol}
                </div>
              </div>
              <span>
                <ArrowRightOutlined />
              </span>
              <div className="pair-item">
                <div className="symbol">
                  <Image
                    src={swapPair[1].icon!}
                    alt="Currency Logo"
                    height="16"
                    width="16"
                  />
                </div>
                <div className="value">
                  {swapPair[1].formatted} {swapPair[1].symbol}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="tip">Proceed in your wallet</div>
      </Modal>
    </>
  );
}

export default ConfirmModal;
