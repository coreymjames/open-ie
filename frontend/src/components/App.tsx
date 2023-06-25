import { useEffect, useState } from "react";
import { GlobalState } from "@/types";
import ConnectWallet from "./connect-wallet";

import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";

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
import { AppContextProvider, useAppContext } from "@/context";
import { trpc } from "@/trpc";
import VotingPage from "./VotingPage";
import { ethers } from "ethers";

import {
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';


const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [    jsonRpcProvider({
    rpc: (chain) => ({
      http: `http://127.0.0.1:8545`,
    }),
  }),]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<GlobalState | null>(null);

  useEffect(() => {
    trpc()
      .getData.query()
      .then((data) => {
        setState(data);
        console.log(data);

        setIsLoading(false);
      });
  }, []);

  if (isLoading && !state) {
    return <div id="app">Loading</div>;
  }
  if (!state) {
    return <div id="app">Error</div>;
  }

  return (
    <AppContextProvider>
      <Main state={state} />
    </AppContextProvider>
  );
}

import { OpenIE__factory } from '../contracts/typechain-types';

function Main({ state }: { state: GlobalState }) {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const contract = OpenIE__factory.connect(contractAddress.Token, provider);
  
  useEffect(() => {
    (async () => {
    const projects = await contract.get_projects();
    console.log(projects);
    })();
  });

  const { setProjects } = useAppContext();
  useEffect(() => {
    setProjects(state.projects);
    // @TODO - remove hardcoded projects
    //   setProjects([
    //     {
    //         "id": "f4f67524-1728-4aed-94a1-85590d003464",
    //         "githubLink": "https://github.com/wagmi-dev/wagmi",
    //         "npmLink": "https://www.npmjs.com/package/wagmi",
    //         "isTest": true,
    //         "metrics": [
    //           { id: 1,
    //             metricType: MetricType.NUM_DEPENDANTS,
    //             value: 2,
    //             projectId: "f4f67524-1728-4aed-94a1-85590d003464"
    //           },
    //           { id: 2,
    //             metricType: MetricType.NUM_GITHUB_CONTRIBUTORS,
    //             value: 4,
    //             projectId: "f4f67524-1728-4aed-94a1-85590d003464"
    //           },
    //           { id: 3,
    //             metricType: MetricType.NUM_GITHUB_STARS,
    //             value: 6,
    //             projectId: "f4f67524-1728-4aed-94a1-85590d003464"
    //           },
    //           { id: 4,
    //             metricType: MetricType.NUM_NPM_DOWNLOADS,
    //             value: 8,
    //             projectId: "f4f67524-1728-4aed-94a1-85590d003464"
    //           },
    //         ]
    //     },
    //     {
    //       "id": "f4f67524-1728-4aed-94a1-85590d003463",
    //       "githubLink": "https://github.com/wagmi-dev/nope",
    //       "npmLink": "https://www.npmjs.com/package/123",
    //       "isTest": true,
    //       "metrics": [
    //         { id: 1,
    //           metricType: MetricType.NUM_DEPENDANTS,
    //           value: 8,
    //           projectId: "f4f67524-1728-4aed-94a1-85590d003463"
    //         },
    //         { id: 2,
    //           metricType: MetricType.NUM_GITHUB_CONTRIBUTORS,
    //           value: 6,
    //           projectId: "f4f67524-1728-4aed-94a1-85590d003463"
    //         },
    //         { id: 3,
    //           metricType: MetricType.NUM_GITHUB_STARS,
    //           value: 4,
    //           projectId: "f4f67524-1728-4aed-94a1-85590d003463"
    //         },
    //         { id: 4,
    //           metricType: MetricType.NUM_NPM_DOWNLOADS,
    //           value: 2,
    //           projectId: "f4f67524-1728-4aed-94a1-85590d003463"
    //         },
    //       ]
    //   }
    // ]
    // )
  }, [state.projects, setProjects]);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <ConnectWallet />
            <VotingPage />
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </div>
  );
}
