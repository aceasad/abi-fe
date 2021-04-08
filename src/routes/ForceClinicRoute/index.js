import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from 'routes';
import {
  makeSelectIsAuthenticated,
  makeSelectIsForceClinicRequired,
  makeSelectCurrentUser,
} from 'redux/selectors/Auth';
import Loading from 'components/shared-components/Loading';

export function ForceClinicRoute({ component: Component, type, ...rest }) {
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());
  const isClinicForceRequired = useSelector(makeSelectIsForceClinicRequired());
  const user = useSelector(makeSelectCurrentUser());

  const getComponentByPasswordAndLoginStatus = (props) =>
    isClinicForceRequired ? (
      <Component {...props} />
    ) : (
      <Redirect to={ROUTES.DASHBOARD} />
    );
  const getComponent = (props) =>
    !user ? <Loading /> : getComponentByPasswordAndLoginStatus(props);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? getComponent(props) : <Redirect to={ROUTES.LOGIN} />
      }
    />
  );
}

export default ForceClinicRoute;
