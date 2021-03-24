import { defineMessages } from "react-intl";

export const scope = "reset_password_page";

export default defineMessages({
  passwordInputLabel: {
    id: `${scope}.input_label.password`,
    defaultMessage: "password",
  },
  passwordRepeatInputLabel: {
    id: `${scope}.input_label.passwordRepeat`,
    defaultMessage: "password confirm",
  },
  confirmButton: {
    id: `${scope}.button.confirm_button`,
    defaultMessage: "Confirm",
  },
  matches_password: {
    id: `${scope}.matches.password`,
    defaultMessage:
      "Password must contain at least 8 characters,one upper letter,one number and one special character.",
  },
});
