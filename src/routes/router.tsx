import Root from "./Root";
import Summary from "features/Summary/Summary";
import Result from "./Result";
import ErrorPage from "features/ErrorPage/ErrorPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Result />,
      },
      {
        path: "summary",
        element: <Summary />,
      },
    ],
  },
]);

export default router;
