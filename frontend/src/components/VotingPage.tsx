import { useAppContext } from "@/context";
import ProjectList from "./ProjectList";
import QuadraticWeights from "./QuadraticWeights";

function VotingPage() {
  return (
    <div className="grid grid-cols-3 p-4">
      <div className="col-span-3">
        <Weights />
      </div>
      <div className="col-span-1">
        <QuadraticWeights />
      </div>
      <div className="col-span-2">
        <ProjectList />
      </div>
    </div>
  );
}

function Weights() {
  const { weights } = useAppContext();
  return (
    <div>
      <h3>Weights</h3>
      <div className="flex gap-2">
        {weights.map((weight) => (
          <div key={weight.metricType}>
            {weight.metricType}: {weight.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotingPage;
