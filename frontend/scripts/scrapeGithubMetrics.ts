import { MetricType, Prisma, PrismaClient, Project } from '@prisma/client';
import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";


import { GITHUB_GRAPHQL_API, GITHUB_TOKEN } from "./config";

export const graphQLClient = new GraphQLClient(GITHUB_GRAPHQL_API, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});


interface MetricInput {
  metricType: MetricType,
  projectId: string,
  value: number,
}

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();

  const githubMetricTypes = [MetricType.NUM_GITHUB_COMMITS, MetricType.NUM_GITHUB_CONTRIBUTORS, MetricType.NUM_GITHUB_STARS];

  let newMetrics: MetricInput[] = [];

  let i = 0;
  for (const project of projects) {
    console.log('project: ', i, projects.length, project.githubLink);
    i += 1;
    if (!project.githubLink) {
      continue;
    }

    let [owner, name] = project.githubLink.split('/').slice(-2);
    if (name.endsWith('#main')) {
      name = name.slice(0, -5);
    }
    if (name.endsWith('.git')) {
      name = name.slice(0, -4);
    }
    // name = name.split('.')[0];
    let githubMetrics;
    try {
      githubMetrics = await getGithubMetrics(owner, name);
    } catch (e) {
      console.log('Failed to get metrics for: ', project.githubLink);
      continue;
    }

    await prisma.project.update({ where: { id: project.id }, data: {
      description: githubMetrics.description,
    }});

    for (const metric of githubMetricTypes) {
      // @ts-ignore
      const value: number = githubMetrics[metric];

      newMetrics.push({
        projectId: project.id,
        metricType: metric as any,
        value
      });
    }
  }

  await prisma.metric.createMany({
    data: newMetrics
  });
}

export const getGithubMetricsQuery = gql`
query getRepoIssues($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    stargazers {
      totalCount
    }
    mentionableUsers {
      totalCount
    }
    refs(refPrefix: "refs/") {
      totalCount
    }
    description
  }
}
`;

interface GithubMetrics {
  [MetricType.NUM_GITHUB_CONTRIBUTORS]: number,
  [MetricType.NUM_GITHUB_STARS]: number,
  [MetricType.NUM_GITHUB_COMMITS]: number,
  description: string,
}

async function getGithubMetrics(owner: string, name: string): Promise<GithubMetrics> {
  const res: any = await graphQLClient.request(getGithubMetricsQuery, {
    owner,
    name,
  });

  return {
    [MetricType.NUM_GITHUB_STARS]: res.repository.stargazers.totalCount,
    [MetricType.NUM_GITHUB_CONTRIBUTORS]: res.repository.mentionableUsers.totalCount,
    [MetricType.NUM_GITHUB_COMMITS]: res.repository.refs.totalCount,
    description: res.repository.description,
  }
}





(async () => await main())()