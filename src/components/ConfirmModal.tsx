import React, { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { Button, Modal, Steps, Descriptions, Divider } from "antd";
import type { FetchFeeDataResult } from "@wagmi/core";
import { SwapPair } from "./context";
import { gasLimit } from "./constant";
import {
  PriceInfo,
  getMinReceived,
  getNFloatNumber,
  getNetworkFee,
} from "./utils";
// import { DownOutlined } from "@ant-design/icons";
// import type { CurrencyV } from "./currencyMap";

import homeStyles from "@/styles/Home.module.less";
import styles from "@/styles/ConfirmModal.module.less";
import { PathQueryResult } from "iziswap-sdk/lib/search/types";
import Rate from "./Rate";

type ConfirmModalPropsType = {
  isModalOpen: boolean;
  priceInfo: PriceInfo;
  searchPathInfo: PathQueryResult;
  feeData: FetchFeeDataResult | undefined;
  onCancel: () => void;
  onOk: () => void;
};

function ConfirmModal(props: ConfirmModalPropsType) {
  const { isModalOpen, priceInfo, searchPathInfo, feeData, onCancel, onOk } =
    props;
  const swapPair = useContext(SwapPair);

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

  const [isSteping, setIsSteping] = useState(false);

  return (
    <>
      <Modal
        title="Review swap"
        wrapClassName={styles["review-modal"]}
        centered
        open={isModalOpen}
        footer={
          <Button
            className={homeStyles["swap-primary-btn"]}
            type="primary"
            size="large"
            onClick={() => onOk()}
          >
            Confirm swap
          </Button>
        }
        onCancel={onCancel}
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
        title="Steps Modal"
        wrapClassName={styles["steps-modal"]}
        centered
        open={isSteping}
        footer={
          <Steps
            size="small"
            current={1}
            items={[
              {
                title: "Finished",
              },
              {
                title: "In Progress",
              },
              {
                title: "Waiting",
              },
            ]}
          />
        }
        onOk={onOk}
        onCancel={() => setIsSteping(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}

export default ConfirmModal;
