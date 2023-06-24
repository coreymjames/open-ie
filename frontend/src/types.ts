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
