import { useAppContext } from "@/context";
import { ProjectWithMetrics, Weight } from "@/types";
import { Metric } from "@prisma/client";

function ProjectList() {
  const { projects, weights } = useAppContext();

  function calculateMetricValue(projectMetric: Metric, weights: Weight[]) {
    const weight = weights.find(
      (weight) => weight.metricType === projectMetric.metricType
    );
    return weight!.value * projectMetric.value;
  }

  function rewardFunction(project: ProjectWithMetrics, weights: Weight[]) {
    const result: number = project.metrics.reduce((acc, metric) => {
      return acc + calculateMetricValue(metric, weights);
    }, 0);
    return result;
  }
  //
  return (
    <div className="m-4 divide-y border-gray-300 divide-gray-300  border-x-[1px] last:border-b-[1px] first:border-t-[1px] first:rounded-t">
      <div className="rounded-t p-4 bg-gray-100"></div>
      {projects
        .sort((a, b) => rewardFunction(a, weights) - rewardFunction(b, weights))
        .map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index + 1} />
        ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: ProjectWithMetrics;
  index: number;
}) {
  return (
    <div className="w-full p-2 odd:bg-gray-50 even:bg-white flex gap-2 flex-wrap">
      <div>{index}</div>
      <div className="w-full">
        <div className="w-full">Project Name</div>
        <div className="flex justify-evenly w-full">
          {project.metrics.map((metric) => (
            <ProjectMetric key={metric.id} metric={metric} />
          ))}
        </div>
        <div>{project.githubLink}</div>
        <div>{project.npmLink}</div>
      </div>
    </div>
  );
}

const MetricTypeDisplay = {
  NUM_DEPENDANTS: "Dependents",
  NUM_GITHUB_CONTRIBUTORS: "Github Contributors",
  NUM_GITHUB_STARS: "Github Stars",
  NUM_NPM_DOWNLOADS: "NPM Downloads",
};

function ProjectMetric({ metric }: { metric: Metric }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl">{metric.value}</div>
      <div className="text-xs">{MetricTypeDisplay[metric.metricType]}</div>
    </div>
  );
}
export default ProjectList;
