import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Viewtrip from "./view-trip/[tripId]/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/view-trip/:tripId",
    element: <Viewtrip />,
  },
]);

export default router;
