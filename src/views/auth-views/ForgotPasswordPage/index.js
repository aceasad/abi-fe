import React from 'react';
import { ForgotPasswordForm } from 'containers/Forms/ForgotPasswordForm/ForgotPasswordForm';
import messages from './messages';
import { useIntl } from 'react-intl';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';

const ForgotPassword = (props) => {
  const { formatMessage } = useIntl();
  const email = props.location.state;

  return (
    <AuthFormWrapper
      title={formatMessage(messages.forgottenPasswordTitle)}
      paragraph={formatMessage(messages.forgotPasswordParagraph)}
    >
      <ForgotPasswordForm email={email} />
    </AuthFormWrapper>
  );
};

export default ForgotPassword;
