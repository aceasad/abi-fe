import { defineMessages } from 'react-intl';

export const scope = 'reset_password_page';

export default defineMessages({
  passwordInputLabel: {
    id: `${scope}.input_label.password`,
    defaultMessage: 'New Password',
  },
  passwordRepeatInputLabel: {
    id: `${scope}.input_label.passwordRepeat`,
    defaultMessage: 'Confirm New Password',
  },
  confirmButton: {
    id: `${scope}.button.confirm_button`,
    defaultMessage: 'Confirm',
  },
  matches_password: {
    id: `${scope}.matches.password`,
    defaultMessage: 'Password must be in valid format',
  },
  minimumCharacters: {
    id: `${scope}.note.min_characters`,
    defaultMessage: 'At least {min} characters',
  },
  upperAndLowerMixture: {
    id: `${scope}.note.upper_and_lower_mix`,
    defaultMessage: 'A mixture of both uppercase and lowercase letters',
  },
  lettersAndNumberMixture: {
    id: `${scope}.note.char_and_letter_mix`,
    defaultMessage: 'A mixture of letters and numbers',
  },
  specialCharacters: {
    id: `${scope}.note.special_characters`,
    defaultMessage:
      'Inclusion of at least one special character, e.g., ! @ # ? ]',
  },
  specialCharactersExcluded: {
    id: `${scope}.note.special_characters_excluded`,
    defaultMessage:
      'Note: do not use < or > in your password, as both can cause problems in Web browsers',
  },
  passwordSuccessfullyChanged: {
    id: `${scope}.text.successfully_changed_password`,
    defaultMessage: 'Password successfully changed.',
  },
});
