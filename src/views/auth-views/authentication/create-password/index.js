import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from "./messages";
import { useIntl } from "react-intl";
import AuthFormWrapper from "components/layout-components/AuthFormWrapper";
import CreatePassowrdForm from "views/auth-views/components/CreatePasswordForm.js";
import { makeSelectCurrentUser } from "redux/selectors/Users";
import { PASSWORD_STATUSES } from "constants/UserConstants";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "redux/actions/Auth";
import { Button } from "antd";

const LoginPage = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const user = useSelector(makeSelectCurrentUser());

  return (
    <>
      <Button
        type="primary"
        className="authentication-logout"
        onClick={() => dispatch(signOut())}
      >
        {formatMessage(messages.logOut)}
        <LogoutOutlined />
      </Button>

      <AuthFormWrapper title={formatMessage(messages.createPasswordTitle)}>
        {user.password_changed_status === PASSWORD_STATUSES.EXPIRED ? (
          <p>{formatMessage(messages.passwordHasExpired)}</p>
        ) : (
          <CreatePassowrdForm {...props} />
        )}
      </AuthFormWrapper>
    </>
  );
};

export default LoginPage;
