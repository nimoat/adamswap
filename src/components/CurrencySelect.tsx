import React from "react";
import Image from "next/image";
import { Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { CurrencyV } from "./currencyMap";

import styles from "../styles/CurrencySelect.module.less";

interface CurrcySelectProps {
  currency?: CurrencyV;
  disabled?: boolean;
  onClick: () => object | void;
}

const CurrencySelect = (props: CurrcySelectProps) => {
  const { currency, disabled, onClick } = props;

  return (
    <>
      {currency?.symbol ? (
        <Button
          className={styles.CurrencySelect}
          type="text"
          size="small"
          onClick={onClick}
        >
          <Image
            src={currency.logoSrc!}
            alt="Currency Logo"
            height="24"
            width="24"
          />
          <span className="currencyName">{currency?.symbol}</span>
          <DownOutlined />
        </Button>
      ) : (
        <Button
          className={disabled ? styles.disabled : ""}
          type="primary"
          size="middle"
          disabled={disabled}
          onClick={disabled ? () => {} : onClick}
        >
          Select token <DownOutlined />
        </Button>
      )}
    </>
  );
};

export default CurrencySelect;
