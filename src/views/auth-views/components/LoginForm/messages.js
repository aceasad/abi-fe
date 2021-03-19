import { defineMessages } from "react-intl";

export const scope = "login_page";

export default defineMessages({
  loginButton: {
    id: `${scope}.button.login`,
    defaultMessage: "Log In"
  },
  forgotPasswordLink: {
    id: `${scope}.text.forgot_password`,
    defaultMessage: "Forgot yout password?"
  },
  emailInputLabel: {
    id: `${scope}.input_label.email`,
    defaultMessage: "Email Address"
  },
  passwordInputLabel: {
    id: `${scope}.input_label.password`,
    defaultMessage: "Password"
  },
  passwordCantStartWithSpace: {
    id: `${scope}.validation.trim_password`,
    defaultMessage: "Password can't start with space"
  },
  invalidEmailOrPassword: {
    id: `${scope}.error.invalid_username_or_password`,
    defaultMessage: "Invalid username or password"
  }
});
