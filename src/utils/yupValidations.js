import * as Yup from 'yup';
import messages from './messages';

Yup.setLocale({
  mixed: {
    required: messages.required,
    oneOf: messages.oneOf,
  },
  string: {
    email: messages.email,
    min: messages.min,
    max: messages.max,
    matches: messages.matches,
  },
  number: {
    min: messages.greatherThan,
    max: messages.lowerThan,
    positive: messages.positiveNumber,
    matches: messages.matches,
    moreThan: messages.moreThanAnother,
  },
  array: {
    min: messages.emptyArray,
  },
});

export default Yup;
