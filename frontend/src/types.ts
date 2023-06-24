import { Prisma } from "@prisma/client";

export interface GlobalState {
  projects: ProjectWithMetrics;
}

export type ProjectWithMetrics = Prisma.ProjectGetPayload<{
  include: {
    metrics: true;
  }
}>;