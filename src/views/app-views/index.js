import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import PrivateRoute from 'routes/PrivateRoute';

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <PrivateRoute
          exact
          path={`${APP_PREFIX_PATH}/overview`}
          component={lazy(() => import(`./OverviewPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/appointments`}
          component={lazy(() => import(`./AppointmentsPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/patients`}
          component={lazy(() => import(`./PatientsPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/staff`}
          component={lazy(() => import(`./StaffPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/conversation`}
          component={lazy(() => import(`./ChatPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/settings`}
          component={lazy(() => import(`./SettingsPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/clinic`}
          component={lazy(() => import(`./ClinicPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/industry_average`}
          component={lazy(() => import(`./IndustryAveragePage`))}
        />
        <Redirect
          from={`${APP_PREFIX_PATH}`}
          to={`${APP_PREFIX_PATH}/overview`}
        />
      </Switch>
    </Suspense>
  );
};

export default React.memo(AppViews);
