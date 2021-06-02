import { defineMessages } from 'react-intl';

export const scope = 'global';

export default defineMessages({
  email: {
    id: `${scope}.validations.email`,
    defaultMessage: '{label} must be a valid email',
  },
  required: {
    id: `${scope}.validations.required`,
    defaultMessage: '{label} is required',
  },
  oneOf: {
    id: `${scope}.validations.one_of`,
    defaultMessage: '{label} must match with {value}',
  },
  min: {
    id: `${scope}.validations.min`,
    defaultMessage: '{label} must be at least {minValue} characters',
  },
  max: {
    id: `${scope}.validations.max`,
    defaultMessage: '{label} must be max {maxValue} characters',
  },
  sessionExpired: {
    id: `${scope}.session_expired`,
    defaultMessage: 'Your session has expired',
  },
  positiveNumber: {
    id: `${scope}.validations.positive_number`,
    defaultMessage: '{label} must be positive number',
  },
  greatherThan: {
    id: `${scope}.validations.greater_than_number`,
    defaultMessage: '{label} must be greather than {minNumber}',
  },
  lowerThan: {
    id: `${scope}.validations.lower_than_number`,
    defaultMessage: '{label} must be lower than {maxNumber}',
  },
  moreThanAnother: {
    id: `${scope}.validations.more_than_another`,
    defaultMessage: '{thisLabel} must be greater than {anotherLabel}',
  },
  matches: {
    id: `${scope}.validations.matches`,
    defaultMessage: '{matchesLabel}',
  },
  endTimeTimeGreatherThenStart: {
    id: `${scope}.validations.end_greather_then_start`,
    defaultMessage: 'End time must be greather than start time',
  },
  emptyArray: {
    id: `${scope}.validations.empty_array`,
    defaultMessage: 'Please select at least one option',
  },
});
