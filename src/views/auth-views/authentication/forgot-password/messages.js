import { defineMessages } from "react-intl";

export const scope = "forgot_password_page";

export default defineMessages({
  forgottenPasswordTitle: {
    id: `${scope}.text.forgotten_password_title`,
    defaultMessage: "Forgotten password"
  },
  forgotPasswordParagraph: {
    id: `${scope}.text.forgotten_password_paragraph`,
    defaultMessage: `Please enter the email you use to sign in to Abi. We'll then send you an email with the instructions to follow.`
  },
  privacyPolicyLink: {
    id: `${scope}.link.privacy_policy`,
    defaultMessage: "Privacy policy"
  },
  termsAndConditionsLink: {
    id: `${scope}.link.terms_and_conditions`,
    defaultMessage: "Terms and conditions"
  }
});
