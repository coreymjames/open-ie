import { useEffect, useState } from "react";
import { GlobalState } from "@/types";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createConfig, configureChains, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ConnectWallet from "./connect-wallet";
import VotingPage from "./VotingPage";
import { trpc } from "../trpc";

// import { createPublicClient, http } from 'viem';
import { createPublicClient, http } from "viem";
import { AppContextProvider, useAppContext } from "@/context";
import { MetricType } from "@prisma/client";

// const publicClient = createPublicClient({
//   chain: mainnet,
//   transport: http()
// })

const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const projectId = "YOUR_PROJECT_ID";

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
    return <div id="app">Loading</div>;
  }

  return (
    <AppContextProvider>
      <Main state={state} />
    </AppContextProvider>
  );
}

function Main({ state }: { state: GlobalState }) {
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
