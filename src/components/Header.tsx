import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";
import { useAccount, useNetwork } from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import logo from "@/assets/logo.png";

import styles from "@/styles/Home.module.less";

export default function Header() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

  const { isConnected } = useAccount();
  const { chain: connectChain, chains } = useNetwork();
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal();

  const isCorrectChain = useMemo(
    () => connectChain && chains.some((item) => item.id === connectChain.id),
    [connectChain, chains]
  );

  useEffect(() => {
    if (isCorrectChain) {
      closeWeb3Modal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrectChain]);

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  return (
    <header>
      <div
        className={styles.backdrop}
        style={{
          opacity: isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
        }}
      />
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src={logo.src} alt="EasySwap" height="40" width="40" />
          <div className={styles.logoName}>EasySwap</div>
        </div>
        <div className={styles.buttons}>
          <div
            onClick={closeAll}
            className={`${styles.highlight} ${
              isNetworkSwitchHighlighted ? styles.highlightSelected : ``
            }`}
          >
            {isCorrectChain || !isConnected ? (
              <w3m-network-button />
            ) : (
              <Button
                type="text"
                danger
                icon={<WarningOutlined />}
                onClick={() => openWeb3Modal({ view: "Networks" })}
              >
                Wrong Network
              </Button>
            )}
          </div>
          <div
            onClick={closeAll}
            className={`${styles.highlight} ${
              isConnectHighlighted ? styles.highlightSelected : ``
            }`}
          >
            <w3m-button balance="hide" />
          </div>
        </div>
      </div>
    </header>
  );
}
