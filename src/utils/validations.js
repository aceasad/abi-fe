import Yup from './yupValidations';
import {
  maxDigits,
  passwordFormat,
  passwordMinLength,
  phoneFormat,
} from 'constants/Validation';
import {
  MAX,
  MAX_GOOGLE_LINK_LENGTH,
  MIN_PHONE_LENGTH,
  MAX_PHONE_LENGTH,
} from '../constants/ClinicConstants';
import messages from './messages';

const passwordValidation = Yup.string()
  .matches(passwordFormat)
  .min(passwordMinLength)
  .required();

const passwordRepeatValidation = (refField) =>
  Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required()
    .oneOf([Yup.ref(refField)]);

const usernameSchema = Yup.string().email().required();
const nameSchema = Yup.string().trim().max(MAX).required();

export const loginSchema = Yup.object().shape({
  username: usernameSchema,
  password: passwordValidation,
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export const clinicSchema = Yup.object().shape({
  name: nameSchema,
  google_maps_link: Yup.string()
    .trim()
    .required()
    .url()
    .max(MAX_GOOGLE_LINK_LENGTH),
  phone_number: Yup.string()
    .trim()
    .required()
    .matches(phoneFormat)
    .max(MAX_PHONE_LENGTH)
    .min(MIN_PHONE_LENGTH),
  address: Yup.string().trim().required().max(MAX),
  parking_availability: Yup.string().required(),
  start_of_work: Yup.string().required(),
  end_of_work: Yup.string()
    .required()
    .when('start_of_work', (start, schema) => {
      return schema.test({
        test: (end) => end > start,
        message: messages.endTimeTimeGreatherThenStart,
      });
    }),
});

export const createPasswordSchema = Yup.object().shape({
  password: passwordValidation,
  passwordRepeat: passwordRepeatValidation('password'),
});

export const resetPasswordSchema = Yup.object().shape({
  password: passwordValidation,
  passwordRepeat: passwordRepeatValidation('password'),
});

export const industryAveragesSchema = Yup.object().shape({
  cost_of_missed_appointments: Yup.string().max(maxDigits).required(),
  did_not_attend: Yup.string().max(maxDigits).required(),
  uptake: Yup.string().max(maxDigits).required(),
  coverage: Yup.string().max(maxDigits).required(),
  number_of_women_screened_after_invite: Yup.string().max(maxDigits).required(),
  number_of_women_eligible_for_screen: Yup.string().max(maxDigits).required(),
  number_of_women_screened_in_past_3_y: Yup.string().max(maxDigits).required(),
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
  oldPassword: passwordValidation,
  newPassword: passwordValidation,
  newPasswordConfirm: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .required()
    .oneOf([Yup.ref('newPassword')]),
});

export const patientSchema = Yup.object().shape({
  first_name: Yup.string().trim().max(MAX).required(),
  last_name: Yup.string().trim().max(MAX).required(),
  gender: Yup.string().required(),
  date_of_birth: Yup.string().required(),
  height: Yup.number(),
  weight: Yup.number(),
  phone_number: Yup.string().matches(phoneFormat).max(MAX).required(),
  number_of_dependants: Yup.number(),
  insurance: Yup.string().max(MAX),
  area_of_living: Yup.string().max(MAX),
});

export const userSchema = Yup.object().shape({
  name: nameSchema,
  username: usernameSchema,
  password: passwordValidation,
  confirmPassword: passwordRepeatValidation('password'),
});

export const updateUserSchema = Yup.object().shape({
  name: nameSchema,
  username: usernameSchema,
  password: Yup.string().matches(passwordFormat).min(passwordMinLength),
  confirmPassword: Yup.string()
    .matches(passwordFormat)
    .min(passwordMinLength)
    .oneOf([Yup.ref('password')])
    .when('password', (password, schema) =>
      !password ? schema : schema.required()
    ),
});

export const personalDetailsSchema = Yup.object().shape({
  name: nameSchema,
  username: usernameSchema,
});
