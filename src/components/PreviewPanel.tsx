import React, { useContext } from "react";
import { Collapse, Descriptions } from "antd";
import { SwapPair } from "./context";
import {
  PriceInfo,
  getMinReceived,
  getNFloatNumber,
  getNetworkFee,
} from "./utils";
import Rate from "./Rate";
import Image from "next/image";
import gas from "@/assets/gas.svg";
import { PathQueryResult } from "iziswap-sdk/lib/search/types";
import type { FetchFeeDataResult } from "@wagmi/core";
import { gasLimit } from "./constant";

import homeStyles from "@/styles/Home.module.less";

type PreviewPanelProps = {
  searchPathInfo: PathQueryResult;
  feeData: FetchFeeDataResult | undefined;
  priceInfo: PriceInfo;
};

const PreviewPanel = (props: PreviewPanelProps) => {
  const { searchPathInfo, feeData, priceInfo } = props;

  const swapPair = useContext(SwapPair);

  const networkFee = feeData?.gasPrice
    ? getNetworkFee(feeData.gasPrice, gasLimit, priceInfo)
    : "";

  return (
    <Collapse
      items={[
        {
          label: <Rate />,
          extra: (
            <span>
              <Image
                src={gas.src}
                alt="gas"
                height="15"
                width="15"
                color="#fff"
              />
              {networkFee}
            </span>
          ),
          children: (
            <Descriptions
              className={homeStyles["swap-descriptions"]}
              column={1}
              colon={false}
              items={[
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
          ),
        },
      ]}
      expandIconPosition="end"
      onChange={() => {}}
    />
  );
};

export default PreviewPanel;
