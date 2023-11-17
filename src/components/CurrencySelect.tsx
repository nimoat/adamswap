import React from "react";
import Image from "next/image";
import { Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { CurrencyV } from "./currencyMap";

import styles from "../styles/CurrencySelect.module.less";

interface CurrcySelectProps {
  currency?: CurrencyV;
  onClick: () => object | void;
}

const CurrencySelect = (props: CurrcySelectProps) => {
  return (
    <>
      {props.currency?.symbol ? (
        <Button
          className={styles.CurrencySelect}
          type="text"
          size="small"
          onClick={props.onClick}
        >
          <Image
            src={props.currency.logoSrc!}
            alt="Currency Logo"
            height="24"
            width="24"
          />
          <span className="currencyName">{props.currency?.symbol}</span>
          <DownOutlined />
        </Button>
      ) : (
        <Button type="primary" size="middle" onClick={props.onClick}>
          Select token <DownOutlined />
        </Button>
      )}
    </>
  );
};

export default CurrencySelect;
