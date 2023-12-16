import React, { useState } from "react";
import { Collapse, Radio, InputNumber } from "antd";
import { defaultSlippage } from "./constant";

import styles from "@/styles/UserSetting.module.less";

type UserSettingProps = {
  slippage: number | null;
  setSlippage: (n: number | null) => void;
};

const UserSetting = (props: UserSettingProps) => {
  const { slippage, setSlippage } = props;

  const [isSlippageCustom, setIsSlippageCustom] = useState(false);

  const onRadioChange = (v: boolean) => {
    setIsSlippageCustom(v);
    if (!v) {
      setSlippage(defaultSlippage);
    }
  };

  const onSlippageInputChange = (v: number | null) => {
    setSlippage(v ?? 0);
  };

  const onSlippageInputBlur = () => {
    if (!slippage) {
      setSlippage(defaultSlippage);
      setIsSlippageCustom(false);
    }
  };

  return (
    <Collapse
      className={styles.UserSettingModal}
      items={[
        {
          key: 0,
          label: <span>Max. slippage</span>,
          extra: <span>{slippage}%</span>,
          children: (
            <>
              <Radio.Group
                options={[
                  { label: "Auto", value: false },
                  { label: "Custom", value: true },
                ]}
                value={isSlippageCustom}
                optionType="button"
                buttonStyle="solid"
                size="large"
                onChange={(e) => onRadioChange(e.target.value)}
              />
              <InputNumber
                controls={false}
                suffix="%"
                min={0}
                max={20}
                size="large"
                precision={2}
                value={slippage}
                maxLength={4}
                disabled={!isSlippageCustom}
                onChange={onSlippageInputChange}
                onBlur={onSlippageInputBlur}
              />
            </>
          ),
        },
      ]}
      defaultActiveKey={[0]}
      expandIconPosition="end"
    />
  );
};

export default UserSetting;
