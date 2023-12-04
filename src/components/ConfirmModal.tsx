import React, { useCallback, useContext, useMemo, useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Button, Modal, Descriptions, Divider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { FetchFeeDataResult } from "@wagmi/core";
import {
  erc20ABI,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
} from "wagmi";
import Steps from "./Steps";
import { getTokenChainPath } from "iziswap-sdk/lib/base";
import { SwapPair } from "./context";
import { swapContractAddress, swapAbi, gasLimit } from "./constant";
import {
  PriceInfo,
  getMinReceived,
  getNFloatNumber,
  getNetworkFee,
} from "./utils";

import homeStyles from "@/styles/Home.module.less";
import styles from "@/styles/ConfirmModal.module.less";
import { PathQueryResult } from "iziswap-sdk/lib/search/types";
import Rate from "./Rate";

type ConfirmModalPropsType = {
  isModalOpen: boolean;
  priceInfo: PriceInfo;
  searchPathInfo: PathQueryResult;
  feeData: FetchFeeDataResult | undefined;
  onPreviewClose: () => void;
};

function ConfirmModal(props: ConfirmModalPropsType) {
  const { isModalOpen, priceInfo, searchPathInfo, feeData, onPreviewClose } =
    props;
  const swapPair = useContext(SwapPair);

  // const [isSteping, setIsSteping] = useState(false);
  const [needApprove, setNeedApprove] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { address: accountAddress } = useAccount();

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
      setIsApproving(false);
      onPreviewClose();
      if (allowance && allowance >= swapPair[0].value) {
        writeSwap();
      } else {
        //@TODO 参考UNI
      }
    },
  });

  // swap上链前
  const { isLoading, isSuccess, data, error, write } = useContractWrite({
    abi: swapAbi,
    functionName: "swapAmount",
    address: swapContractAddress,
    gas: gasLimit,
    gasPrice: feeData?.gasPrice ?? undefined, // Legacy Transactions.
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

  const writeSwap = useCallback(() => {
    setIsSwapping(true);
    onPreviewClose();
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
      value: swapPair[0].address ? 0n : swapPair[0].value,
    });
  }, [accountAddress, searchPathInfo, swapPair, write]);

  const onConfirmSwap = useCallback(() => {
    // 检查授权
    if (
      (!allowanceData || allowanceData < swapPair[0].value) &&
      swapPair[0].address
    ) {
      approveWrites?.({
        args: [swapContractAddress, swapPair[0].value],
      });
      setIsApproving(true);
      setNeedApprove(true);
      onPreviewClose();
    } else {
      setNeedApprove(false);
      writeSwap();
    }
  }, [allowanceData, swapPair, approveWrites, writeSwap]);

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
        onCancel={onPreviewClose}
      >
        <div className="swap-pair">
          {swapPairPlus.map((item) => (
            <div className="pair-item" key={item.symbol}>
              <div className="tip">{item.tip}</div>
              <div className="center">
                <div className="value">
                  {item.formatted} {item.symbol}
                </div>
                <div className="symbol">
                  <Image
                    src={item.logoSrc!}
                    alt="Currency Logo"
                    height="32"
                    width="32"
                  />
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
              { key: 2, label: "Max. slippage", children: "0.5%" },
              {
                key: 3,
                label: "Min. received",
                children: `${
                  getMinReceived(swapPair[1].value, swapPair[1].decimals!)
                    .formated
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
          <Image src={logo.src} alt="Currency Logo" height="32" width="203" />
        }
        wrapClassName={styles["steps-modal"]}
        centered
        open={isApproving || isSwapping}
        footer={needApprove ? <Steps items={steps} /> : null}
        onCancel={() => {
          setIsApproving(false);
          setIsSwapping(false);
        }}
      >
        {isApproving && (
          <Image
            src={swapPair[0].logoSrc!}
            alt="Currency Logo"
            height="36"
            width="36"
          />
        )}
        {isSwapping && <LoadingOutlined />}
        {isApproving && <p>Enable spending {swapPair[0].symbol} on EZSwap</p>}
        {isSwapping && <p>Some contents...</p>}
        <div className="tip">Proceed in your wallet</div>
      </Modal>
    </>
  );
}

export default ConfirmModal;
