import React from "react";
import Image from "next/image";
import { Button } from "antd";
import { DownOutlined } from '@ant-design/icons';
import currenctLogoMap from './CurrenctLogoMap'

import styles from "../styles/CurrencySelect.module.less"

interface CurrcySelectProps {
  onClick: () => {} | void;
}

const CurrencySelect = (props: CurrcySelectProps) => {

  return (
    <Button className={styles.CurrencySelect} type="text" size="small" onClick={props.onClick}>
      <Image
        src={currenctLogoMap.ETH}
        alt="WalletConnect Logo"
        height="24"
        width="24"
      />
      <span className="currencyName">ETH</span>
      <DownOutlined />
    </Button>
  );
};

export default CurrencySelect;
