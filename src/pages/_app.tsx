import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import Head from "next/head";
import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { scrollSepolia } from "wagmi/chains";
import { ConfigProvider } from "antd";
import theme from "../theme/themeConfig";
import Footer from "@/components/Footer";
import favicon from "@/assets/favicon.ico";

import "@/styles/globals.css";

const chains = [scrollSepolia];

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: chains[0],
});

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Head>
        <title>EasySwap</title>
        <meta
          name="description"
          content="The most user-friendly DEX Aggregator, focusing on Layer2 ecosystem."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon.src} />
      </Head>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <ConfigProvider theme={theme}>
            <Component {...pageProps} />
            <Footer />
          </ConfigProvider>
        </WagmiConfig>
      ) : null}
    </>
  );
}
