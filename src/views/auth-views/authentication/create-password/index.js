import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../../../../assets/sass/views/auth/login.scss';
import messages from './messages';
import { useIntl } from 'react-intl';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';
import CreatePassowrdForm from 'views/auth-views/components/CreatePasswordForm.js';
import { makeSelectCurrentUser } from 'redux/selectors/Users';
import { PASSWORD_STATUSES } from 'constants/UserConstants';
import { LogoutOutlined } from '@ant-design/icons';
import { signOut } from 'redux/actions/Auth';

const LoginPage = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const user = useSelector(makeSelectCurrentUser);

  return (
    <div>
      <div className="float-right">
        <span onClick={() => dispatch(signOut())}>
          <LogoutOutlined className="mr-3" />
          <span className="font-weight-normal">
            {formatMessage(messages.logOut)}
          </span>
        </span>
      </div>
      <AuthFormWrapper title={formatMessage(messages.createPasswordTitle)}>
        {user.password_changed_status === PASSWORD_STATUSES.EXPIRED ? (
          <p>{formatMessage(messages.passwordHasExpired)}</p>
        ) : (
          <CreatePassowrdForm {...props} />
        )}
      </AuthFormWrapper>
    </div>
  );
};

export default LoginPage;
