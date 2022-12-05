import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Summary from "./features/Summary/Summary";
import ErrorPage from "features/ErrorPage/ErrorPage";
import { store } from "app/store";
import Root from "./routes/Root";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "summary",
    element: <Summary />,
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN ?? ""}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID ?? ""}
      redirectUri={window.location.origin}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
