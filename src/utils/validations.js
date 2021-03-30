import Yup from './yupValidations';
import {
  passwordFormat,
  passwordMinLength,
  max16digits,
} from 'constants/Validation';

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

export const industryAveragesSchema = Yup.object().shape({
  cost_of_missed_appointments: Yup.string().required().matches(max16digits),
  did_not_attend: Yup.string().required().matches(max16digits),
  uptake: Yup.string().required().matches(max16digits),
  coverage: Yup.string().required().matches(max16digits),
  number_of_women_screened_after_invite: Yup.string()
    .required()
    .matches(max16digits),
  number_of_women_eligible_for_screen: Yup.string()
    .required()
    .matches(max16digits),
  number_of_women_screened_in_past_3_y: Yup.string()
    .required()
    .matches(max16digits),
});

export const staffValidationSchema = Yup.object().shape({
  first_name: Yup.string().trim().required(),
  last_name: Yup.string().trim().required(),
  date_of_birth: Yup.string().required(),
  ethnicity: Yup.string().required(),
  specialization: Yup.string().required(),
  seniority: Yup.string().required(),
});
