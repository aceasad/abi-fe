import React from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import messages from "./messages";
import { useIntl } from "react-intl";
import AuthFormWrapper from "components/layout-components/AuthFormWrapper";

const LoginPage = (props) => {
  const { formatMessage } = useIntl();

  return (
    <AuthFormWrapper title={formatMessage(messages.loginTitle)}>
      <LoginForm {...props} />
    </AuthFormWrapper>
  );
};

export default LoginPage;
