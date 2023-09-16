import React from "react";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";

type WagmiProviderType = {
  children: React.ReactNode;
};

const chains = [polygonMumbai];
const projectId = 'df4584507be5ee2f06f3b9ef0fdb4a59';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const themeVariables = {
  "--w3m-font-family": "Roboto, sans-serif",
  "--w3m-accent-color": "#D33C23"
};

const ethereumClient = new EthereumClient(wagmiConfig, chains);
const WagmiProvider = ({ children }: WagmiProviderType) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeVariables={themeVariables} />
    </>
  );
};

export default WagmiProvider;