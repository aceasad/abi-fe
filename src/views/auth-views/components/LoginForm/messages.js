import { defineMessages } from "react-intl";

export const scope = "login_page";

export default defineMessages({
  loginButton: {
    id: `${scope}.button.login`,
    defaultMessage: "Log In",
  },
  forgotPasswordLink: {
    id: `${scope}.text.forgot_password`,
    defaultMessage: "Forgot yout password?",
  },
  emailInputLabel: {
    id: `${scope}.input_label.email`,
    defaultMessage: "Email Address",
  },
  passwordInputLabel: {
    id: `${scope}.input_label.password`,
    defaultMessage: "Password",
  },
});
