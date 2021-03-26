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
          component={lazy(() => import(`./LoginPage`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/forgot-password`}
          component={lazy(() => import(`./ForgotPasswordPage`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/not-found`}
          component={lazy(() => import(`./errors/PageNotFound`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/something-went-wrong`}
          component={lazy(() => import(`./errors/SomethingWentWrong`))}
        />
        <ResetPasswordRoute
          exact
          path={`${AUTH_PREFIX_PATH}/create-password`}
          component={lazy(() => import(`./CreatePasswordPage`))}
        />
        <Route
          path={`${AUTH_PREFIX_PATH}/reset-password/:token/:email`}
          component={lazy(() => import(`./ResetPasswordPage`))}
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
