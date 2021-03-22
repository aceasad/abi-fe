import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "routes";
import {
  makeSelectCurrentUser,
  makeSelectIsAuthenticated
} from "../../redux/selectors/Users";
import Loading from "components/shared-components/Loading";

export function PrivateRoute({ component: Component, type, ...rest }) {
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());
  const user = useSelector(makeSelectCurrentUser());

  const getComponent = (props) =>
    !user ? <Loading /> : <Component {...props} />;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? getComponent(props) : <Redirect to={ROUTES.LOGIN} />
      }
    />
  );
}

export default PrivateRoute;
