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
  passwordValidFormat: {
    id: `${scope}.validation.valid_password`,
    defaultMessage: "Password must be in valid format"
  },
  invalidEmailOrPassword: {
    id: `${scope}.error.invalid_username_or_password`,
    defaultMessage: "Invalid username or password"
  },
  minimumCharacters: {
    id: `${scope}.note.min_characters`,
    defaultMessage: "At least {min} characters"
  },
  upperAndLowerMixture: {
    id: `${scope}.note.upper_and_lower_mix`,
    defaultMessage: "A mixture of both uppercase and lowercase letters"
  },
  lettersAndNumberMixture: {
    id: `${scope}.note.char_and_letter_mix`,
    defaultMessage: "A mixture of letters and numbers"
  },
  specialCharacters: {
    id: `${scope}.note.special_characters`,
    defaultMessage:
      "Inclusion of at least one special character, e.g., ! @ # ? ]"
  },
  specialCharactersExcluded: {
    id: `${scope}.note.special_characters_excluded`,
    defaultMessage:
      "Note: do not use < or > in your password, as both can cause problems in Web browsers"
  },
  logOut: {
    id: `${scope}.text.log_out`,
    defaultMessage: "Log out"
  },
  createPasswordError: {
    id: `${scope}.error.create_password`,
    defaultMessage: "Failed to create password, try again later"
  }
});
