import React from "react";

import styles from "../styles/Steps.module.less";

type StepsPropType = {
  items: Array<{ key: string | number; active: boolean }>;
};

export default function Steps(props: StepsPropType) {
  const { items } = props;
  return (
    <div className={styles["steps"]}>
      {items.map((item) => (
        <div
          className={`steps-item ${item.active ? "active" : ""}`}
          key={item.key}
        />
      ))}
    </div>
  );
}
