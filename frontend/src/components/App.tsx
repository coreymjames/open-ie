import { useEffect, useState } from "react";
import { trpc } from "../trpc";
import { GlobalState } from "@/types";
import ConnectWallet from "./connect-wallet";

import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, configureChains, mainnet, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
// import { createPublicClient, http } from 'viem'; 
import { createPublicClient, http } from 'viem'

// const publicClient = createPublicClient({
//   chain: mainnet,
//   transport: http()
// })

const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

const projectId = 'YOUR_PROJECT_ID';

const { connectors, wallets } = getDefaultWallets({
  appName: "Hypercerts",
  projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<any | null>(null);

  useEffect(() => {
    trpc()
      .getData.query()
      .then((data) => {
        setState(data);
				console.log(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div id="app">
				Loading
      </div>
    );
	}

	return <Main state={state} />

}

function Main({ state }: { state: GlobalState }) {
  return <div>
    <QueryClientProvider client={queryClient}>
    <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
    <ConnectWallet />
    <VotingPage />
    </RainbowKitProvider>
    </WagmiConfig>
    </QueryClientProvider>
  </div>
}
import '@rainbow-me/rainbowkit/styles.css';
import VotingPage from "./VotingPage";
