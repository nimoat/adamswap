import React, { useEffect, useState } from "react";
import { Modal, Input, Divider } from "antd";
import Image from "next/image";
import { SearchOutlined } from "@ant-design/icons";
import type { Currency } from "./currencyMap";
import { getNFloatNumber } from "./utils";

import styles from "../styles/CurrencySelectModal.module.less";

interface CurrencySelectModalProps {
  currencyMap: Record<string, Currency>;
  open: boolean;
  onSelect: (c: Currency) => unknown | void;
  onCancel: () => unknown | void;
}

export default function CurrencySelectModal(props: CurrencySelectModalProps) {
  const { currencyMap, open, onSelect, onCancel } = props;

  const [filtedCurrencyMap, setFiltedCurrencyMap] = useState(
    Object.values(currencyMap)
  );

  useEffect(() => {
    setFiltedCurrencyMap(Object.values(currencyMap));
  }, [currencyMap]);

  const onSearchChange = (value: string) => {
    const _value = value.toLowerCase();
    const _filtedCurrencyMap = Object.values(currencyMap).filter(
      (item) =>
        item.name.toLowerCase().indexOf(_value) >= 0 ||
        item.symbol!.toLowerCase().indexOf(_value) >= 0
    );
    setFiltedCurrencyMap(_filtedCurrencyMap);
  };

  const onCurrencySelect = (currency: Currency) => {
    onSelect(currency);
  };

  return (
    <Modal
      wrapClassName={styles.CurrencySelectModal}
      width={418}
      open={open}
      title="Select a token"
      footer={null}
      onCancel={onCancel}
    >
      <div className="search-warpper">
        <Input
          prefix={<SearchOutlined />}
          size="large"
          placeholder="Search name or address"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Divider />
      <div className="currency-list">
        {filtedCurrencyMap.map((currency) => (
          <div
            className="cuurrency-item"
            key={currency.symbol}
            onClick={(e) => {
              e.stopPropagation();
              onCurrencySelect(currency);
            }}
          >
            <div className="icon">
              <Image
                src={currency.icon}
                alt="Currency Logo"
                height="36"
                width="36"
              />
            </div>
            <div className="label">
              <div className="name">{currency.name}</div>
              <div className="symbol">{currency.symbol}</div>
            </div>
            <div className="balance">
              {getNFloatNumber(currency.banlanceFormatted)}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
