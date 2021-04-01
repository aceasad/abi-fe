import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AppLayout from 'layouts/app-layout';
import AuthLayout from 'layouts/auth-layout';
import AppLocale from 'lang';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig';
import { PrivateRoute } from 'routes/PrivateRoute';
import ForceClinicRoute from '../routes/ForceClinicRoute';
import { ROUTES } from 'routes';
import CreatePatient from './app-views/PatientsPage/CreatePatient';
import UpdatePatient from './app-views/PatientsPage/UpdatePatient';

export const Views = ({ location, locale }) => {
  const currentAppLocale = AppLocale[locale];

  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ConfigProvider locale={currentAppLocale.antd}>
        <Switch>
          <Route exact path="/">
            <Redirect to={APP_PREFIX_PATH} />
          </Route>
          <Route path={AUTH_PREFIX_PATH} component={AuthLayout} />
          <Route
            exact
            path={`${APP_PREFIX_PATH}/new-patient`}
            component={CreatePatient}
          />
          <Route
            exact
            path={`${APP_PREFIX_PATH}/edit-patient`}
            component={UpdatePatient}
          />
          <Suspense fallback={() => <h1>LOADING</h1>}>
            <ForceClinicRoute
              exact
              path={`${APP_PREFIX_PATH}/first-clinic-update`}
              component={lazy(() => import(`./app-views/ClinicPage`))}
            />

            <PrivateRoute
              path={APP_PREFIX_PATH}
              component={(props) => (
                <AppLayout {...props} location={location} />
              )}
            />
          </Suspense>
          <Redirect to={ROUTES.LOGIN} />
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
};

const mapStateToProps = ({ theme, auth }) => {
  const { locale } = theme;
  const { token } = auth;
  return { locale, token };
};

export default withRouter(connect(mapStateToProps)(Views));
