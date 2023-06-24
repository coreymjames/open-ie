import { useAppContext } from "@/context";
import { classNames } from "@/lib/classNames";
import { useEffect, useState } from "react";

interface Metric {
  name: string;
  
}

const metrics:Metric[] = [
  {
    name: "Metric 1"
  },
  {
    name: "Metric 2"
  }
]

function VotingPage () {
 return (
  <>
    <RemainingCredits/>
    <div>
      {metrics.map(metric => <MetricCard key={metric.name} name={metric.name}/>)}
    </div>
  </>
 )
}


function MetricCard ({name}: {name: string}) {
  return (
  <div>
    {name}
    <VoteInput />
  </div>
  )
}

function VoteInput () {
  const {setRemainingCredits, remainingCredits} = useAppContext(); 
  const [creditsUsed, setCreditsUsed] = useState<number>(0);
  const [votes, setVotes] = useState<number>(0);
  const [increaseDisabled, setIncreaseDisabled] = useState<boolean>(false);
  const [decreaseDisabled, setDecreaseDisabled] = useState<boolean>(false);
  
  function handleIncreaseVotes () {
    if (increaseDisabled) return;
    const tempVotes = votes + 1;
    const cost = tempVotes * tempVotes;
    setVotes(tempVotes);
    setCreditsUsed(cost);
    setRemainingCredits(remaining => remaining - (cost - (votes * votes)));
  }

  function handleDecreaseVotes () {
    if (decreaseDisabled) return;
    const tempVotes = votes - 1;
    const cost = tempVotes * tempVotes;
    setVotes(tempVotes);
    setCreditsUsed(cost);
    setRemainingCredits(remaining => remaining + ((votes * votes) - cost));
  }

  useEffect(() => {
    const cost = votes * votes;
    if (votes > 0){
      if (cost > remainingCredits){
        setIncreaseDisabled(true);
      } else {
        setIncreaseDisabled(false);
      }
    } else {
      if (cost > remainingCredits){
        setDecreaseDisabled(true);
      } else {
        setDecreaseDisabled(false);
      }
    }
    
  }, [votes, remainingCredits])

  return (
  <div className="flex gap-2 items-center">
    <button className={classNames('p-4 border-[1px] border-gray-400 cursor-pointer', decreaseDisabled ? 'bg-gray-600 cursor-not-allowed' : '')} onClick={handleDecreaseVotes}>-</button>
    <div>Votes: {votes}</div>
    <button className={classNames('p-4 border-[1px] border-gray-400 cursor-pointer', increaseDisabled ? 'bg-gray-600 cursor-not-allowed' : '')} onClick={handleIncreaseVotes}>+</button>
    <div>
      Credits Used: {creditsUsed}
    </div>
  </div>
  )
}

function RemainingCredits () {
  const {remainingCredits} = useAppContext();
  return ( 
  <div>
    <h3>Remaining Credits:</h3>
    {remainingCredits}
  </div>
  )
}

export default VotingPage;