import { useAppContext } from "@/context";
import { useState } from "react";

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
  const {setRemainingCredits} = useAppContext(); 
  const [creditsUsed, setCreditsUsed] = useState<number>(0);
  const [votes, setVotes] = useState<number>(0);
  
  function handleIncreaseVotes () {
    const tempVotes = votes + 1;
    const cost = tempVotes * tempVotes;
    setVotes(tempVotes);
    setCreditsUsed(cost);
    setRemainingCredits(remaining => remaining - (cost - (votes * votes)));
  }

  function handleDecreaseVotes () {
    const tempVotes = votes - 1;
    const cost = tempVotes * tempVotes;
    setVotes(tempVotes);
    setCreditsUsed(cost);
    setRemainingCredits(remaining => remaining + ((votes * votes) - cost));
  }

  return (
  <div className="flex gap-2">
    <button onClick={handleDecreaseVotes}>-</button>
    <div>Votes: {votes}</div>
    <button onClick={handleIncreaseVotes}>+</button>
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