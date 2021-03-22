import React from "react";
import { useSelector } from "react-redux";

import "../../../../assets/sass/views/auth/login.scss";
import messages from "./messages";
import { useIntl } from "react-intl";
import AuthFormWrapper from "components/layout-components/AuthFormWrapper";
import CreatePassowrdForm from "views/auth-views/components/CreatePasswordForm.js";
import { makeSelectCurrentUser } from "redux/selectors/Users";
import { PASSWORD_STATUSES } from "constants/UserConstants";

const LoginPage = (props) => {
  const { formatMessage } = useIntl();

  const user = useSelector(makeSelectCurrentUser);

  return (
    <AuthFormWrapper title={formatMessage(messages.createPasswordTitle)}>
      {user.password_changed_status === PASSWORD_STATUSES.EXPIRED ? (
        <p>{formatMessage(messages.passwordHasExpired)}</p>
      ) : (
        <CreatePassowrdForm {...props} />
      )}
    </AuthFormWrapper>
  );
};

export default LoginPage;
