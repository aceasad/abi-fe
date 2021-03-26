import { defineMessages } from 'react-intl';

export const scope = 'forgot_password_page';

export default defineMessages({
  emailInputLabel: {
    id: `${scope}.input_label.email`,
    defaultMessage: 'Email Address',
  },
  confirmButton: {
    id: `${scope}.button.confirm_button`,
    defaultMessage: 'Confirm',
  },
  successfulySentEmail: {
    id: `${scope}.text.successfuly_sent`,
    defaultMessage: 'Email sent successfully',
  },
  errorSentEmail: {
    id: `${scope}.text.error_sent`,
    defaultMessage: "User with this email doesn't exists",
  },
});
