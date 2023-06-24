import { useAppContext } from "@/context";
import { classNames } from "@/lib/classNames";
import { MetricType } from "@prisma/client";
import { PropsWithChildren, useEffect, useState } from "react";
import ProjectList from "./ProjectList";

function VotingPage() {
  return (
    <div className="grid grid-cols-3 p-4">
      <div className="col-span-3">
        <RemainingCredits />
      </div>
      <div className="col-span-3">
        <Weights />
      </div>
      <div className="col-span-1">
        <MetricCard type={MetricType.NUM_DEPENDANTS} />
        <MetricCard type={MetricType.NUM_GITHUB_STARS} />
        <MetricCard type={MetricType.NUM_NPM_DOWNLOADS} />
        <MetricCard type={MetricType.NUM_GITHUB_CONTRIBUTORS} />
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

function MetricCard({ type }: { type: MetricType }) {
  return (
    <div className="p-4">
      {type}
      <VoteInput metricType={type} />
    </div>
  );
}

function VoteInput({ metricType }: { metricType: MetricType }) {
  const { setRemainingCredits, remainingCredits, setProjects, setWeight } =
    useAppContext();
  const [creditsUsed, setCreditsUsed] = useState<number>(0);
  const [votes, setVotes] = useState<number>(0);
  const [increaseDisabled, setIncreaseDisabled] = useState<boolean>(false);
  const [decreaseDisabled, setDecreaseDisabled] = useState<boolean>(false);

  function handleIncreaseVotes() {
    if (increaseDisabled) return;
    const tempVotes = votes + 1;
    const cost = tempVotes * tempVotes;
    setVotes(tempVotes);
    setWeight(metricType, 1);
    setCreditsUsed(cost);
    setRemainingCredits((remaining) => remaining - (cost - votes * votes));
  }

  function handleDecreaseVotes() {
    if (decreaseDisabled) return;
    const tempVotes = votes - 1;
    const cost = tempVotes * tempVotes;
    setWeight(metricType, -1);
    setVotes(tempVotes);
    setCreditsUsed(cost);
    setRemainingCredits((remaining) => remaining + (votes * votes - cost));
  }

  useEffect(() => {
    const cost = votes * votes;
    if (votes > 0) {
      if (cost > remainingCredits) {
        setIncreaseDisabled(true);
      } else {
        setIncreaseDisabled(false);
      }
    } else {
      if (cost > remainingCredits) {
        setDecreaseDisabled(true);
      } else {
        setDecreaseDisabled(false);
      }
    }
  }, [votes, remainingCredits]);

  return (
    <div className="flex gap-2 items-center">
      <VoteButton disabled={decreaseDisabled} handleClick={handleDecreaseVotes}>
        -
      </VoteButton>
      <div>Votes: {votes}</div>
      <VoteButton disabled={increaseDisabled} handleClick={handleIncreaseVotes}>
        +
      </VoteButton>
      <div>Credits Used: {creditsUsed}</div>
    </div>
  );
}

interface VoteButtonProps {
  disabled: boolean;
  handleClick: () => void;
}
function VoteButton({
  children,
  disabled,
  handleClick,
}: PropsWithChildren<VoteButtonProps>) {
  return (
    <button
      className={classNames(
        "p-4 border-[1px] border-gray-400 font-bold",
        disabled
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-blue-500 text-white cursor-pointer"
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

function RemainingCredits() {
  const { remainingCredits } = useAppContext();
  return (
    <div>
      <h3>Remaining Credits:</h3>
      {remainingCredits}
    </div>
  );
}

export default VotingPage;
