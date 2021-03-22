import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "components/shared-components/Loading";
import { APP_PREFIX_PATH } from "configs/AppConfig";

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <Route
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
          component={lazy(() => import(`./ConversationPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/settings`}
          component={lazy(() => import(`./SettingsPage`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/clinic`}
          component={lazy(() => import(`./ClinicPage`))}
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
