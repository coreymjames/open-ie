import { useEffect, useState } from "react";
import { trpc } from "../trpc";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<any | null>(null);

  useEffect(() => {
    trpc()
      .getData.query()
      .then((data) => {
        setState(data);
				console.log(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div id="app">
				Loading
      </div>
    );
	}

	return (
		<div>
			loaded
		</div>
	);
}
