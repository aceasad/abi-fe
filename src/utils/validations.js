import Yup from "./yupValidations";
import { passwordFormat, passwordMinLength } from "constants/Validation";

export const loginSchema = Yup.object().shape({
  username: Yup.string().email().required(),
  password: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required()
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required()
});
