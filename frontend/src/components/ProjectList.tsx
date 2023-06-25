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
    <div className="mx-4 divide-y divide-gray-300 border-x-[1px]  border-gray-300 first:rounded-t first:border-t-[1px] last:border-b-[1px]">
      <div className="rounded-t bg-gray-100 p-2 text-sm font-medium">
        Repositories
      </div>
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
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="flex w-full flex-wrap gap-2 px-6 odd:bg-gray-50 even:bg-white">
      <div className="flex w-full items-center">
        <div className="mr-2 flex justify-center border-r-[1px] py-4 pr-6">
          {index}
        </div>
        <h4 className="flex-1 whitespace-nowrap p-4 text-xl font-light">
          Project Name
        </h4>
        <div className="flex w-full justify-evenly  p-4">
          {project.metrics.map((metric) => (
            <ProjectMetric key={metric.id} metric={metric} />
          ))}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => setShowDetails((show: boolean) => !show)}
        >
          v
        </div>
      </div>
      {showDetails && (
        <div className="grid w-full grid-cols-4 border-t-[1px] border-gray-300 py-4 text-sm">
          <div className="col-span-3 mr-12">
            <h5 className="mb-1 font-semibold">Project Summary</h5>
            <p className="font-light">
              TODO Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="flex flex-col border-l-[1px] pl-4">
            <h5 className="mb-1 font-semibold">Project Links</h5>
            <a className="font-light underline" href={project.githubLink}>
              Github
            </a>
            <a className="font-light underline" href={project.npmLink}>
              NPM
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectMetric({ metric }: { metric: Metric }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-medium">{metric.value}</div>
      <div className="text-xs">{MetricTypeDisplay[metric.metricType]}</div>
    </div>
  );
}
export default ProjectList;
