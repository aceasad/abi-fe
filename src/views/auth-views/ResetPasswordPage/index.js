import React from 'react';
import ResetPasswordForm from 'containers/Forms/ResetPasswordForm/ResetPasswordForm';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const RestPasswordPage = () => {

  return (
    <AuthFormWrapper title={"Reset password"}>
      <ResetPasswordForm />
    </AuthFormWrapper>
  );
};
export default RestPasswordPage;
