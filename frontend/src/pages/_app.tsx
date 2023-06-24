// Don't let app render on server
// https://colinhacks.com/essays/building-a-spa-with-nextjs
import { useEffect, useState } from "react";
import App from "../components/App";

function Root() {
  const [render, setRender] = useState(false);
  useEffect(() => setRender(true), []);
  return render ? <App /> : null;
}
export default Root;
