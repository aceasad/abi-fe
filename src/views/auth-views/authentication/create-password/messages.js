import { defineMessages } from "react-intl";

export const scope = "create_password_page";

export default defineMessages({
  createPasswordTitle: {
    id: `${scope}.text.create_password_title`,
    defaultMessage: "Create password"
  },
  passwordHasExpired: {
    id: `${scope}.text.password_expired`,
    defaultMessage: "Password has expired"
  }
});
