import React from 'react';
import { ForgotPasswordForm } from 'containers/Forms/ForgotPasswordForm/ForgotPasswordForm';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const ForgotPassword = (props) => {
  const email = props.location.state;

  return (
    <AuthFormWrapper
      title={"Forgotten password"}
      paragraph={"Please enter the email you use to sign in to Asa. We'll then send you an email with the instructions to follow."}
    >
      <ForgotPasswordForm email={email} />
    </AuthFormWrapper>
  );
};

export default ForgotPassword;
