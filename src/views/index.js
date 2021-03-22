import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from "layouts/auth-layout";
import AppLocale from "lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";
import { PrivateRoute } from "routes/PrivateRoute";
import PublicRoute from "routes/PublicRoute";
import { ROUTES } from "routes";

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
          <PublicRoute path={AUTH_PREFIX_PATH} component={AuthLayout} />
          <PrivateRoute
            path={APP_PREFIX_PATH}
            component={(props) => <AppLayout {...props} location={location} />}
          />
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
