import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    required: "{label} is required",
    oneOf: "{label} must match with {value}",
  },
  string: {
    email: "{label} must be a valid email",
    min: "{label} must be at least {minValue} characters",
    max: "{label} must be max {maxValue} characters",
    matches: "{matchesLabel}",
  },
  number: {
    min: "{label} must be greather than {minNumber}",
    max: "{label} must be lower than {maxNumber}",
    positive: "{label} must be positive number",
    matches: "{matchesLabel}",
    moreThan: "{thisLabel} must be greater than {anotherLabel}",
  },
  array: {
    min: "Please select at least one option",
  },
});

export default Yup;
