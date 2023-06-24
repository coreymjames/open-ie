import { useAppContext } from "@/context";
import { classNames } from "@/lib/classNames";
import { MetricType } from "@prisma/client";
import { useEffect, useState } from "react";
import ProjectList from "./ProjectList";

function VotingPage () {
 return (
  <>
    <RemainingCredits/>
    <Weights />
    <div>
      <MetricCard type={MetricType.NUM_DEPENDANTS}/>    
      <MetricCard type={MetricType.NUM_GITHUB_STARS}/>    
      <MetricCard type={MetricType.NUM_NPM_DOWNLOADS}/>    
      <MetricCard type={MetricType.NUM_GITHUB_CONTRIBUTORS}/>    
    </div>
    <ProjectList />
  </>
 )
}

function Weights () {
  const {weights} = useAppContext();
  return (
    <div>
      <h3>Weights</h3>
      <div className="flex gap-2">
      {weights.map(weight => <div key={weight.metricType}>{weight.metricType}: {weight.value}</div>)}
      </div>
    </div>
  )
}

function MetricCard ({type}: {type: MetricType}) {
  return (
  <div>
    {type}
    <VoteInput metricType={type} />
  </div>
  )
}

function VoteInput ({metricType}: {metricType: MetricType}) {
  const {setRemainingCredits, remainingCredits, setProjects, setWeight} = useAppContext(); 
  const [creditsUsed, setCreditsUsed] = useState<number>(0);
  const [votes, setVotes] = useState<number>(0);
  const [increaseDisabled, setIncreaseDisabled] = useState<boolean>(false);
  const [decreaseDisabled, setDecreaseDisabled] = useState<boolean>(false);

  function handleIncreaseVotes () {
    if (increaseDisabled) return;
    const tempVotes = votes + 1;
    const cost = tempVotes * tempVotes;
    setVotes(tempVotes);
    setWeight(metricType, 1);
    setCreditsUsed(cost);
    setRemainingCredits(remaining => remaining - (cost - (votes * votes)));
  }

  function handleDecreaseVotes () {
    if (decreaseDisabled) return;
    const tempVotes = votes - 1;
    const cost = tempVotes * tempVotes;
    setWeight(metricType, -1);
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