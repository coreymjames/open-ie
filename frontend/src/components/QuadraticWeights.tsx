import { useAppContext } from "@/context";
import { classNames } from "@/lib/classNames";
import { MetricTypeDisplay } from "@/types";
import { MetricType } from "@prisma/client";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "./Button";

function QuadraticWeight({ type }: { type: MetricType }) {
  const { setRemainingCredits, remainingCredits, totalCredits, setWeight } =
    useAppContext();
  const [creditsUsed, setCreditsUsed] = useState<number>(0);
  const [votes, setVotes] = useState<number>(0);
  const [increaseDisabled, setIncreaseDisabled] = useState<boolean>(false);
  const [decreaseDisabled, setDecreaseDisabled] = useState<boolean>(false);

  function handleIncreaseVotes(tempVotes: number) {
    if (increaseDisabled) return;
    const cost = tempVotes * tempVotes;

    setVotes(tempVotes);
    setWeight(type, 1);
    setCreditsUsed(cost);
    setRemainingCredits((remaining) => remaining - (cost - votes * votes));
    calcEnabled(tempVotes, cost);
  }

  function handleDecreaseVotes(tempVotes: number) {
    if (decreaseDisabled) return;
    const cost = tempVotes * tempVotes;
    setWeight(type, -1);
    setVotes(tempVotes);
    setCreditsUsed(cost);
    setRemainingCredits((remaining) => remaining + (votes * votes - cost));
    calcEnabled(tempVotes, cost);
  }

  const calcEnabled = useCallback(
    (cost: number, votes: number) => {
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
    },
    [remainingCredits]
  );

  useEffect(() => {
    const cost = Math.abs((votes + 1) * (votes + 1) - votes * votes);
    if (votes >= 0) {
      if (cost > remainingCredits) {
        setIncreaseDisabled(true);
      } else {
        setIncreaseDisabled(false);
      }
    }
    if (votes <= 0) {
      if (cost > remainingCredits) {
        setDecreaseDisabled(true);
      } else {
        setDecreaseDisabled(false);
      }
    }
  }, [votes, remainingCredits]);

  return (
    <div className="grid w-full grid-cols-6 items-center justify-between">
      <div className="col-span-2 text-sm font-medium">
        {MetricTypeDisplay[type]}
      </div>
      <div className="col-span-4 my-2 flex w-full items-center justify-evenly">
        {/* <div className="w-full">
          <input
            type="range"
            min={Math.floor(Math.sqrt(totalCredits)) * -1}
            max={Math.floor(Math.sqrt(totalCredits))}
            defaultValue={0}
            value={votes}
            // className="thumb h-6 w-full bg-gray-300 opacity-70 outline-none hover:opacity-100 "
          ></input>
        </div> */}
        <VoteButton
          disabled={decreaseDisabled}
          handleClick={() => {
            handleDecreaseVotes(votes - 1);
          }}
        >
          -
        </VoteButton>
        <div className="flex flex-col items-center">
          <span>{votes}</span>
          <span className="text-xs uppercase">votes</span>
        </div>
        <VoteButton
          disabled={increaseDisabled}
          handleClick={() => {
            handleIncreaseVotes(votes + 1);
          }}
        >
          +
        </VoteButton>
      </div>
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
        "mx-2 rounded border-[1px] border-gray-400 px-4 py-2 font-bold",
        disabled
          ? "cursor-not-allowed bg-gray-200 text-gray-400"
          : "cursor-pointer bg-blue-200 text-blue-600"
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
        <div className="mb-4 flex items-center justify-between border-b-[1px] pb-4">
          <h6 className="font-medium uppercase">Voice Credits</h6>
          <div className="text-lg font-light">
            <span>{remainingCredits}</span>/{totalCredits}
          </div>
        </div>
        <div className="">
          <QuadraticWeight type={MetricType.NUM_DEPENDANTS} />
          <QuadraticWeight type={MetricType.NUM_GITHUB_STARS} />
          <QuadraticWeight type={MetricType.NUM_NPM_DOWNLOADS} />
          <QuadraticWeight type={MetricType.NUM_GITHUB_CONTRIBUTORS} />
        </div>
      </div>
      <div className="flex justify-between p-6">
        <SecondaryButton>Save & Exit</SecondaryButton>
        <PrimaryButton>Submit</PrimaryButton>
      </div>
    </div>
  );
}
export default QuadraticWeights;
