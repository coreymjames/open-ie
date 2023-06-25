import { useAppContext } from "@/context";
import { MetricTypeDisplay, ProjectWithMetrics, Weight } from "@/types";
import { Metric } from "@prisma/client";
import { useState } from "react";

function ProjectList() {
  const { projects, weights } = useAppContext();

  function calculateMetricValue(projectMetric: Metric, weights: Weight[]) {
    const weight = weights.find(
      (weight) => weight.metricType === projectMetric.metricType
    );
    if (!weight) return 0;
    return weight.value * projectMetric.value;
  }

  function rewardFunction(project: ProjectWithMetrics, weights: Weight[]) {
    const result: number = project.metrics.reduce((acc, metric) => {
      return acc + calculateMetricValue(metric, weights);
    }, 0);
    return result;
  }
  //
  return (
    <div className="mx-4 divide-y divide-gray-300 border-x-[1px]  border-gray-300 first:rounded-t first:border-t-[1px] last:border-b-[1px]">
      <div className="rounded-t bg-gray-100 p-2 text-sm font-medium">
        Repositories
      </div>
      {projects
        .sort((a, b) => rewardFunction(b, weights) - rewardFunction(a, weights))
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
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="flex w-full flex-wrap gap-2 px-6 odd:bg-gray-50 even:bg-white">
      <div className="grid w-full grid-cols-12 items-center">
        <div className=" col-span-2 mr-2 flex justify-center border-r-[1px] py-4 pr-6">
          {index}
        </div>
        <h4 className="col-span-3  flex-1 overflow-hidden text-ellipsis whitespace-nowrap p-4 text-xl font-light">
          {project.name}
        </h4>
        <div className="col-span-6 flex items-baseline justify-evenly gap-2">
          {project.metrics.map((metric) => (
            <ProjectMetric key={metric.id} metric={metric} />
          ))}
        </div>
        <div
          className="flex cursor-pointer justify-end"
          onClick={() => setShowDetails((show: boolean) => !show)}
        >
          v
        </div>
      </div>
      {showDetails && (
        <div className="grid w-full grid-cols-4 border-t-[1px] border-gray-300 py-4 text-sm">
          <div className="col-span-3 mr-12">
            <h5 className="mb-1 font-semibold">Project Summary</h5>
            <p className="font-light">{project.description}</p>
          </div>
          <div className="flex flex-col border-l-[1px] pl-4">
            <h5 className="mb-1 font-semibold">Project Links</h5>
            <a className="font-light underline" href={project.githubLink!}>
              Github
            </a>
            <a
              className="font-light underline"
              href={`https://www.npmjs.com/package/${project.name}`}
            >
              NPM
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectMetric({ metric }: { metric: Metric }) {
  const metricName = MetricTypeDisplay[metric.metricType];
  return (
    <div className="flex flex-col items-center">
      <div className="text-base font-medium">{metric.value}</div>
      <div className="text-xs">{metricName}</div>
    </div>
  );
}
export default ProjectList;
