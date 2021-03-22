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

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().required().matches(passwordRegex),
  passwordRepeat: Yup.string()
    .required()
    .oneOf([Yup.ref("password")]),
});
