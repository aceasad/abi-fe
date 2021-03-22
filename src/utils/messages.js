import { defineMessages } from "react-intl";

export const scope = "global";

export default defineMessages({
  email: {
    id: `${scope}.validations.email`,
    defaultMessage: "{label} must be a valid email",
  },
  required: {
    id: `${scope}.validations.required`,
    defaultMessage: "{label} is required",
  },
  matches: {
    id: `${scope}.validations.matches`,
    defaultMessage: "{label} must match with {matches}",
  },
});
