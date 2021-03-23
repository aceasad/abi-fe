import React from 'react';
import { ForgotPasswordForm } from 'views/auth-views/components/ForgotPasswordForm/ForgotPasswordForm';
import '../../../../assets/sass/views/auth/forgotPassword.scss';
import messages from './messages';
import { useIntl } from 'react-intl';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const ForgotPassword = () => {
  const { formatMessage } = useIntl();

  return (
    <AuthFormWrapper
      title={formatMessage(messages.forgottenPasswordTitle)}
      paragraph={formatMessage(messages.forgotPasswordParagraph)}
    >
      <ForgotPasswordForm />
    </AuthFormWrapper>
  );
};

export default ForgotPassword;
