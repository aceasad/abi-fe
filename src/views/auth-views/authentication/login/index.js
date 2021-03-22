import React from "react";
import { ROUTES } from "routes";
import LoginPage from "../login-page/index";

const Login = () => {
  return <LoginPage allowRedirect={true} redirect={ROUTES.DASHBOARD} />;
};

export default Login;
