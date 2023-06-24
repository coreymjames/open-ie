import { ProjectWithMetrics, Weight } from "@/types";
import { MetricType } from "@prisma/client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type AppProviderProps = { children: React.ReactNode };

export type AppState = {
  remainingCredits: number;
  setRemainingCredits: Dispatch<SetStateAction<number>>;
  projects: ProjectWithMetrics[];
  setProjects: Dispatch<SetStateAction<ProjectWithMetrics[]>>;
  weights: Weight[];
  setWeight: (metricType: MetricType, value: number) => void;
};

export const AppContext = createContext<AppState>({
  remainingCredits: 50,
  setRemainingCredits: () => {},
  projects: [],
  setProjects: () => {},
  weights: [],
  setWeight: () => {},
});

export const AppContextProvider = ({ children }: AppProviderProps) => {
  const [remainingCredits, setRemainingCredits] = useState<number>(50);
  const [projects, setProjects] = useState<ProjectWithMetrics[]>([]);
  const [weights, setWeights] = useState<Weight[]>([
    { metricType: "NUM_DEPENDANTS", value: 1 },
    { metricType: "NUM_GITHUB_STARS", value: 1 },
    { metricType: "NUM_NPM_DOWNLOADS", value: 1 },
    { metricType: "NUM_GITHUB_CONTRIBUTORS", value: 1 },
  ]);

  function setWeight(metricType: MetricType, value: number) {
    setWeights((weights) => {
      return weights.map((weight) => {
        if (weight.metricType === metricType) {
          weight.value = weight.value + value;
        }
        return weight;
      });
    });
  }

  const value = {
    remainingCredits,
    setRemainingCredits,
    projects,
    setProjects,
    weights,
    setWeight,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};