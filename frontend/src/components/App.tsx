import { useEffect, useState } from "react";
import { trpc } from "../trpc";
import { GlobalState } from "@/types";
import ConnectWallet from "./connect-wallet";

import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, configureChains, WagmiConfig, useContractInfiniteReads } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
// import { createPublicClient, http } from 'viem'; 
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  goerli,
} from 'wagmi/chains';
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// const publicClient = createPublicClient({
//   chain: mainnet,
//   transport: http()
// })

const queryClient = new QueryClient();

const projectId = 'YOUR_PROJECT_ID';
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  // [publicProvider()]
  [    jsonRpcProvider({
    rpc: (chain) => ({
      http: `http://127.0.0.1:8545`,
    }),
  }),]
);

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  // {
  //   groupName: 'Other',
  //   // wallets: [
  //   //   argentWallet({ projectId, chains }),
  //   //   trustWallet({ projectId, chains }),
  //   //   ledgerWallet({ projectId, chains }),
  //   // ],
  // },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
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
  // const provider = useProvider();
  // const contract = useContractInfiniteReads({
  //   address: CONTRACT_ADDRESS,
  //   abi: TokenArtifact.abi,
  //   signerOrProvider: provider,
  // });
  return <div>
    <QueryClientProvider client={queryClient}>
    <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
    <ConnectWallet />

  
    </RainbowKitProvider>
    </WagmiConfig>
    </QueryClientProvider>
  </div>
}
import '@rainbow-me/rainbowkit/styles.css';