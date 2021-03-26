import Yup from './yupValidations';
import { passwordFormat, passwordMinLength } from 'constants/Validation';

const passwordValidation = Yup.string()
  .matches(passwordFormat)
  .min(passwordMinLength)
  .required();

const passwordRepeatValidation = Yup.string()
  .matches(passwordFormat)
  .min(passwordMinLength)
  .required()
  .oneOf([Yup.ref('password')]);

export const loginSchema = Yup.object().shape({
  username: Yup.string().email().required(),
  password: passwordValidation,
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
  password: passwordValidation,
  passwordRepeat: passwordRepeatValidation,
});

export const resetPasswordSchema = Yup.object().shape({
  password: passwordValidation,
  passwordRepeat: passwordRepeatValidation,
});

export const staffValidationSchema = Yup.object().shape({
  first_name: Yup.string().trim().required(),
  last_name: Yup.string().trim().required(),
  date_of_birth: Yup.string().required(),
  ethnicity: Yup.string().required(),
  specialization: Yup.string().required(),
  seniority: Yup.string().required(),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required(),
  newPassword: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required(),
  newPasswordConfirm: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required()
    .oneOf([Yup.ref('newPassword')]),
});
