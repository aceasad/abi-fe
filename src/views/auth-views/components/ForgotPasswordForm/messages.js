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
});
