import { MetricType, Prisma } from "@prisma/client";

export interface GlobalState {
  projects: ProjectWithMetrics[];
  // weights: Weight[];
}

export type ProjectWithMetrics = Prisma.ProjectGetPayload<{
  include: {
    metrics: true;
  };
}>;

export type Weight = {
  metricType: MetricType;
  value: number;
};

export const MetricTypeDisplay = {
  NUM_DEPENDANTS: "Dependents",
  NUM_GITHUB_CONTRIBUTORS: "Contributors",
  NUM_GITHUB_STARS: "Stars",
  NUM_NPM_DOWNLOADS: "Downloads",
};
