import { defineMessages } from 'react-intl';

export const scope = 'login_page';

export default defineMessages({
  loginTitle: {
    id: `${scope}.text.login_title`,
    defaultMessage: 'Log In',
  },
  termsAndConditionsLink: {
    id: `${scope}.link.terms_and_conditions`,
    defaultMessage: 'Terms and conditions',
  },
  privacyPolicyLink: {
    id: `${scope}.link.privacy_policy`,
    defaultMessage: 'Privacy policy',
  },
});
