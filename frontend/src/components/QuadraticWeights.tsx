import { useAppContext } from "@/context";
import { classNames } from "@/lib/classNames";
import { MetricTypeDisplay } from "@/types";
import { MetricType } from "@prisma/client";
import { PropsWithChildren, useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "./Button";

function QuadraticWeight({ type }: { type: MetricType }) {
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
    setWeight(type, 1);
    setCreditsUsed(cost);
    setRemainingCredits((remaining) => remaining - (cost - votes * votes));
  }

  function handleDecreaseVotes() {
    if (decreaseDisabled) return;
    const tempVotes = votes - 1;
    const cost = tempVotes * tempVotes;
    setWeight(type, -1);
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
    <div className="grid w-full grid-cols-6 items-center gap-2">
      <div className="text-sm font-medium">{MetricTypeDisplay[type]}</div>
      <div className="col-span-4 flex w-full items-center justify-evenly">
        <VoteButton
          disabled={decreaseDisabled}
          handleClick={handleDecreaseVotes}
        >
          -
        </VoteButton>
        <div>Votes: {votes}</div>
        <VoteButton
          disabled={increaseDisabled}
          handleClick={handleIncreaseVotes}
        >
          +
        </VoteButton>
      </div>
      <div className="col-span-1 flex justify-center">{creditsUsed}</div>
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
        "border-[1px] border-gray-400 p-4 font-bold",
        disabled
          ? "cursor-not-allowed bg-gray-600"
          : "cursor-pointer bg-blue-500 text-white"
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

function QuadraticWeights() {
  const { remainingCredits, totalCredits } = useAppContext();

  return (
    <div className="rounded border-[1px] border-gray-300 bg-white">
      <div className="flex justify-center rounded-t border-b-[1px] border-gray-300 bg-gray-100 p-2 text-sm font-medium">
        Quadratic Weights
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h6>Metrics</h6>
          <div className="text-lg font-light">
            <span>{remainingCredits}</span>/{totalCredits}
          </div>
        </div>
        <QuadraticWeight type={MetricType.NUM_DEPENDANTS} />
        <QuadraticWeight type={MetricType.NUM_GITHUB_STARS} />
        <QuadraticWeight type={MetricType.NUM_NPM_DOWNLOADS} />
        <QuadraticWeight type={MetricType.NUM_GITHUB_CONTRIBUTORS} />
      </div>
      <div className="flex justify-between p-6">
        <SecondaryButton>Save & Exit</SecondaryButton>
        <PrimaryButton>Submit</PrimaryButton>
      </div>
    </div>
  );
}
export default QuadraticWeights;
