import React from "react";

import "../../../../assets/sass/views/auth/login.scss";
import messages from "./messages";
import { useIntl } from "react-intl";
import AuthFormWrapper from "components/layout-components/AuthFormWrapper";
import CreatePassowrdForm from "views/auth-views/components/CreatePasswordForm.js";

const LoginPage = (props) => {
  const { formatMessage } = useIntl();

  return (
    <AuthFormWrapper title={formatMessage(messages.createPasswordTitle)}>
      <CreatePassowrdForm {...props} />
    </AuthFormWrapper>
  );
};

export default LoginPage;
