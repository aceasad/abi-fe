import React from 'react';
import ResetPasswordForm from 'containers/Forms/ResetPasswordForm/ResetPasswordForm';
import messages from './messages';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const RestPasswordPage = () => {

  return (
    <AuthFormWrapper title={messages.resetPasswordTitle}>
      <ResetPasswordForm />
    </AuthFormWrapper>
  );
};
export default RestPasswordPage;
