import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import { AUTH_PREFIX_PATH } from 'configs/AppConfig';
import PublicRoute from 'routes/PublicRoute';
import ResetPasswordRoute from 'routes/ResetPasswordRoute';

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="page" />}>
      <Switch>
        <PublicRoute
          exact
          path={`${AUTH_PREFIX_PATH}/login`}
          component={lazy(() => import(`./authentication/login`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/forgot-password`}
          component={lazy(() => import(`./authentication/forgot-password`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/not-found`}
          component={lazy(() => import(`./errors/page-not-found`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/something-went-wrong`}
          component={lazy(() => import(`./errors/something-went-wrong`))}
        />
        <ResetPasswordRoute
          exact
          path={`${AUTH_PREFIX_PATH}/create-password`}
          component={lazy(() => import(`./authentication/create-password`))}
        />

        <Route
          path={`${AUTH_PREFIX_PATH}/reset-password/:token/:email`}
          component={lazy(() => import(`./authentication/reset-password-page`))}
        />
        <Redirect
          from={`${AUTH_PREFIX_PATH}`}
          to={`${AUTH_PREFIX_PATH}/login`}
        />
      </Switch>
    </Suspense>
  );
};

export default AppViews;
