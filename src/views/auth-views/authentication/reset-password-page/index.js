import React from 'react';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';
import messages from './messages';
import { useIntl } from 'react-intl';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const RestPasswordPage = () => {
  const { formatMessage } = useIntl();

  return (
    <AuthFormWrapper title={formatMessage(messages.resetPasswordTitle)}>
      <ResetPasswordForm />
    </AuthFormWrapper>
  );
};
export default RestPasswordPage;
