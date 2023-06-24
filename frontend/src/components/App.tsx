import { useEffect, useState } from "react";
import { GlobalState } from "@/types";
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createConfig, configureChains, mainnet, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ConnectWallet from "./connect-wallet";
import VotingPage from "./VotingPage";
import { trpc } from "../trpc";

// import { createPublicClient, http } from 'viem'; 
import { createPublicClient, http } from 'viem'
import { AppContextProvider, useAppContext } from "@/context";

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
  const { setProjects } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<any | null>(null);

  useEffect(() => {
    trpc()
      .getData.query()
      .then((data) => {
        setState(data);
        console.log(data);
        setProjects(data.projects)
        setIsLoading(false);
      });
  }, [setProjects]);

  if (isLoading) {
    return (
      <div id="app">
        Loading
      </div>
    );
  }

  return <AppContextProvider><Main state={state} /></AppContextProvider>

}

function Main({ state }: { state: GlobalState }) {
  const { setProjects } = useAppContext();
  useEffect(() => {
    setProjects(state.projects);
  }, [state.projects, setProjects]);

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