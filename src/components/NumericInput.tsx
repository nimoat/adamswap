import React, { useContext, useMemo, useState } from "react";
import { Input } from "antd";
import styles from "../styles/NumericInput.module.less";
import CurrencySelect from "./CurrencySelect";
import CurrencySelectModal from "./CurrencySelectModal";
import type { Currency } from "./currencyMap";
import { PriceInfo, getNFloatNumber } from "./utils";
import { SwapPair } from "./context";

interface NumericInputProps {
  currencyMap: Record<string, Currency> | undefined;
  style?: React.CSSProperties;
  tip?: string;
  index: 0 | 1;
  priceInfo: PriceInfo;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSelect?: (c: Currency) => unknown | void;
}

// const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const NumericInput = (props: NumericInputProps) => {
  const {
    tip = "",
    index = 0,
    priceInfo,
    disabled = false,
    onChange = () => {},
    onSelect: onPropsSelect = () => {},
  } = props;

  const swapPair = useContext(SwapPair);

  const [selectModalShow, setSelectModalShow] = useState(false);

  const valueInUSD = useMemo(() => {
    if (
      swapPair[index]?.symbol &&
      swapPair[index]?.formatted &&
      priceInfo.data[swapPair[index].symbol]
    ) {
      return getNFloatNumber(
        Number(swapPair[index].formatted) *
          priceInfo.data[swapPair[index].symbol]
      );
    }
  }, [swapPair, index, priceInfo]);

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const onHandleBlur = () => {
    let valueTemp = String(swapPair[index]!.formatted);
    if (valueTemp.charAt(valueTemp.length - 1) === ".") {
      valueTemp = valueTemp.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  const onSelect = (currency: Currency) => {
    setSelectModalShow(false);
    onPropsSelect(currency);
  };

  // const title = value ? (
  //   <span className="numeric-input-title">
  //     {value !== "-" ? formatNumber(Number(value)) : "-"}
  //   </span>
  // ) : (
  //   "Input a number"
  // );

  return (
    <>
      <div className={styles["numeric-input"]}>
        <div className="tip">{tip}</div>
        <div className="center">
          <Input
            style={props.style}
            size="large"
            placeholder="0"
            maxLength={16}
            value={swapPair[index]!.formatted}
            disabled={disabled}
            onChange={onHandleChange}
            onBlur={onHandleBlur}
          />
          <CurrencySelect
            currency={swapPair[index]}
            onClick={() => setSelectModalShow(true)}
          />
        </div>
        <div className="bottom">
          <div className="bottom-left">
            {valueInUSD ? "$" + valueInUSD : ""}
          </div>
          <div className="bottom-right">
            {getNFloatNumber(swapPair[index]!.banlanceFormatted) !== "0" &&
              "Balance:" + getNFloatNumber(swapPair[index]!.banlanceFormatted)}
          </div>
        </div>
      </div>
      {props.currencyMap && (
        <CurrencySelectModal
          currencyMap={props.currencyMap}
          open={props.currencyMap && selectModalShow}
          onSelect={onSelect}
          onCancel={() => setSelectModalShow(false)}
        />
      )}
    </>
  );
};

export default NumericInput;
