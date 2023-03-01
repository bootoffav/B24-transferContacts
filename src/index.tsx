import "./styles.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { store } from "app/store";
import router from "routes/router";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import { ClipLoader } from "react-spinners";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN ?? ""}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID ?? ""}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Provider store={store}>
        <WrapWithAuth />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

function WrapWithAuth() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="centered is-flex is-justify-content-center">
        <ClipLoader loading={true} size={300} />
      </div>
    );
  }

  return isAuthenticated ? (
    <RouterProvider router={router} />
  ) : (
    <>{loginWithRedirect()}</>
  );
}
