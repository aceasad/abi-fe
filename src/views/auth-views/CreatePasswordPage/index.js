import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from './messages';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';
import CreatePassowrdForm from 'containers/Forms/CreatePasswordForm.js/index.js';
import { makeSelectCurrentUser } from 'redux/selectors/Auth';
import { PASSWORD_STATUSES } from 'constants/UserConstants';
import { LogoutOutlined } from '@ant-design/icons';
import { signOut } from 'redux/actions/Auth';
import { Button } from 'antd';

const LoginPage = (props) => {
  const dispatch = useDispatch();

  const user = useSelector(makeSelectCurrentUser());

  return (
    <>
      <Button
        type="primary"
        className="authentication-logout"
        onClick={() => dispatch(signOut())}
      >
        {messages.logOut}
        <LogoutOutlined />
      </Button>

      <AuthFormWrapper title={messages.createPasswordTitle}>
        {user.password_changed_status === PASSWORD_STATUSES.EXPIRED ? (
          <p>{messages.passwordHasExpired}</p>
        ) : (
          <CreatePassowrdForm {...props} />
        )}
      </AuthFormWrapper>
    </>
  );
};

export default LoginPage;
