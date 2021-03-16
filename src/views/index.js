import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from "layouts/auth-layout";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";

export const Views = ({ location }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={APP_PREFIX_PATH} />
      </Route>
      <Route path={AUTH_PREFIX_PATH}>
        <AuthLayout />
      </Route>
      <Route path={APP_PREFIX_PATH}>
        <AppLayout location={location} />
      </Route>
    </Switch>
  );
};

const mapStateToProps = ({ theme, auth }) => {
  const { locale } = theme;
  const { token } = auth;
  return { locale, token };
};

export default withRouter(connect(mapStateToProps)(Views));
