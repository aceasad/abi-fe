import { defineMessages } from 'react-intl';

export const scope = 'create_password_page';
export const loginScope = 'login_page';

export default defineMessages({
  passwordInputLabel: {
    id: `${loginScope}.input_label.password`,
    defaultMessage: 'Password',
  },
  passwordRepeatInputLabel: {
    id: `${scope}.input_label.password`,
    defaultMessage: 'Repeat password',
  },
  passwordValidFormat: {
    id: `${loginScope}.validation.valid_password`,
    defaultMessage: 'Password must be in valid format',
  },
  minimumCharacters: {
    id: `${loginScope}.note.min_characters`,
    defaultMessage: 'At least {min} characters',
  },
  upperAndLowerMixture: {
    id: `${loginScope}.note.upper_and_lower_mix`,
    defaultMessage: 'A mixture of both uppercase and lowercase letters',
  },
  lettersAndNumberMixture: {
    id: `${loginScope}.note.char_and_letter_mix`,
    defaultMessage: 'A mixture of letters and numbers',
  },
  specialCharacters: {
    id: `${loginScope}.note.special_characters`,
    defaultMessage:
      'Inclusion of at least one special character, e.g., ! @ # ? ]',
  },
  specialCharactersExcluded: {
    id: `${loginScope}.note.special_characters_excluded`,
    defaultMessage:
      'Note: do not use < or > in your password, as both can cause problems in Web browsers',
  },
  createPassword: {
    id: `${scope}.text.create_password_title`,
    defaultMessage: 'Create password',
  },
});
