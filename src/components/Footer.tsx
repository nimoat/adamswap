import React from "react";
import { Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";
// import { TwitterCircleFilled } from "@ant-design/icons";

import styles from "@/styles/Footer.module.less";

export default function Footer() {
  const router = useRouter();

  return (
    <div className={styles.footer}>
      <div className={styles.linkGroup}>
        <Button type="link" onClick={() => router.push("/")}>
          DEX
        </Button>
        <Button type="link" onClick={() => router.push("/SBTPoints")}>
          SBTPoints
        </Button>
        <Button
          type="link"
          href="https://github.com/Easyswap-fi/Easyswap"
          target="_blank"
        >
          GitHub
        </Button>
        <Tooltip title="Coming soon">
          <Button type="link" disabled>
            Docs
          </Button>
        </Tooltip>
        <Button
          // icon={<TwitterCircleFilled />}
          type="link"
          href="https://twitter.com/easyswap_fi"
          target="_blank"
        >
          Twitter
        </Button>
      </div>
      <div className={styles.copyright}>
        EasySwap Finance Technologies, LLC © 2023
      </div>
    </div>
  );
}
