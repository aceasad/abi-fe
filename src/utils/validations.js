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

export const clinicSchema = Yup.object().shape({
  name: Yup.string().required(),
  google_map_link: Yup.string().required(),
  phone_number: Yup.string().required(), //dodati regex za uk phone number
  address: Yup.string().required(),
});
