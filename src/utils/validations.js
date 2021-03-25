import Yup from './yupValidations';
import { passwordFormat, passwordMinLength } from 'constants/Validation';

export const loginSchema = Yup.object().shape({
  username: Yup.string().email().required(),
  password: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required(),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export const clinicSchema = Yup.object().shape({
  name: Yup.string().required(),
  google_maps_link: Yup.string().required().url(),
  phone_number: Yup.string().required(),
  address: Yup.string().required(),
});

export const createPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required(),
  passwordRepeat: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required()
    .oneOf([Yup.ref('password')]),
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().required().matches(passwordRegex),
  passwordRepeat: Yup.string()
    .required()
    .oneOf([Yup.ref("password")]),
});
