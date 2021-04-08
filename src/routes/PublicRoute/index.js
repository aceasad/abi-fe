import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from 'routes';
import { makeSelectIsAuthenticated } from 'redux/selectors/Auth';

export function PublicRoute({ component: Component, type, ...rest }) {
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to={ROUTES.DASHBOARD} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

export default PublicRoute;
