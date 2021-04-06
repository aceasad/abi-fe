import { defineMessages } from 'react-intl';

export const scope = 'login_page';

export default defineMessages({
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
});
