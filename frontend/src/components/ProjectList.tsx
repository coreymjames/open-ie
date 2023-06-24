import { useAppContext } from "@/context";
import { ProjectWithMetrics, Weight } from "@/types";
import { Metric } from "@prisma/client";

function ProjectList () {
  const { projects, weights } = useAppContext();

  function calculateMetricValue (projectMetric: Metric, weights: Weight[]){
    const weight =  weights.find(weight => weight.metricType === projectMetric.metricType);
    return weight!.value * projectMetric.value;
  }

  function rewardFunction(project: ProjectWithMetrics, weights: Weight[]) {
    const result: number =  project.metrics.reduce((acc, metric) => {
      return acc + calculateMetricValue(metric, weights);
    }, 0);
    console.log("result", result);
    return result;  
  }
  
  return (
    <div>
      {projects.sort((a,b) => rewardFunction(a, weights) - rewardFunction(b, weights)).map(project => <ProjectCard key={project.id} project={project} />)}
    </div>
  )
}

function ProjectCard ({project}: {project: ProjectWithMetrics}) {
  return (
  <div className="p-2 bg-slate-100 border-2 border-slate-300 flex gap-2 flex-wrap">
    <div>
      Rank 1
    </div>
    <div>
      <div className="w-full">{project.id}</div>
      <div>{project.githubLink}</div>
      <div>{project.npmLink}</div>
    </div>
  </div>
  )
}


export default ProjectList;