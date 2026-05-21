import React from 'react';
import { ForgotPasswordForm } from 'containers/Forms/ForgotPasswordForm/ForgotPasswordForm';
import messages from './messages';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const ForgotPassword = (props) => {
  const email = props.location.state;

  return (
    <AuthFormWrapper
      title={messages.forgottenPasswordTitle}
      paragraph={messages.forgotPasswordParagraph}
    >
      <ForgotPasswordForm email={email} />
    </AuthFormWrapper>
  );
};

export default ForgotPassword;
