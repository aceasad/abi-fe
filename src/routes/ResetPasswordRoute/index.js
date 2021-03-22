import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "routes";
import {
  makeSelectIsAuthenticated,
  maskeSelectIsPasswordCreateRequired,
  makeSelectCurrentUser
} from "../../redux/selectors/Users";
import Loading from "components/shared-components/Loading";

export function ResetPasswordRoute({ component: Component, type, ...rest }) {
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());
  const isPasswordCreateRequired = useSelector(
    maskeSelectIsPasswordCreateRequired()
  );
  const user = useSelector(makeSelectCurrentUser());

  const getComponentByPasswordStatus = (props) =>
    isPasswordCreateRequired ? (
      <Component {...props} />
    ) : (
      <Redirect to={ROUTES.DASHBOARD} />
    );

  const getComponent = (props) =>
    !user ? <Loading /> : getComponentByPasswordStatus(props);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? getComponent(props) : <Redirect to={ROUTES.LOGIN} />
      }
    />
  );
}

export default ResetPasswordRoute;
