import * as Yup from "yup";
import messages from "./messages";

Yup.setLocale({
  mixed: {
    required: messages.required,
  },
  string: {
    email: messages.email,
    matches: messages.matches,
  },
});

export default Yup;
