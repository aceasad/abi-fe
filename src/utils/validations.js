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
import {
  MASS_INVITE_MAX_AGE,
  MASS_INVITE_MIN_AGE,
} from 'constants/ChatConstants';

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

const usernameSchema = Yup.string().email();
const nameSchema = Yup.string().trim().max(MAX).required();
const externalIdentificationFormat = /^(?:\d{7}|\d{10})$/;

export const loginSchema = Yup.object().shape({
  username: usernameSchema,
  password: passwordValidation,
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export const clinicSchema = Yup.object().shape({
  name: nameSchema,
  google_maps_link: Yup.string().trim().url().max(MAX_GOOGLE_LINK_LENGTH),
  phone_number: Yup.string()
    .trim()
    .required()
    .matches(phoneFormat)
    .max(MAX_PHONE_LENGTH)
    .min(MIN_PHONE_LENGTH),
  street_number: Yup.string().trim().max(8),
  street_name: Yup.string().trim().max(128).required(),
  area_of_living: Yup.string().trim().max(128),
  city: Yup.string().trim().required().max(64).required(),
  post_code: Yup.string().trim().max(16).required(),
  country: Yup.string().trim().max(64),
  parking_availability: Yup.string().required(),
  start_of_work: Yup.string().required(),
  end_of_work: Yup.string().required(),
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
  average_appointment_cost: Yup.string().max(maxDigits).required(),
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
  phone_number: Yup.string().matches(phoneFormat).max(MAX).required(),
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
  gender: Yup.string(),
  date_of_birth: Yup.string().nullable(),
  height: Yup.number(),
  weight: Yup.number(),
  country_code: Yup.string().matches(phoneFormat).max(MAX).required(),
  phone_number: Yup.string().matches(phoneFormat).max(MAX).required(),
  email: usernameSchema,
  number_of_dependants: Yup.number(),
  insurance: Yup.string().max(MAX),
  street_number: Yup.string().max(8),
  street_name: Yup.string().max(128),
  area_of_living: Yup.string().max(128),
  city: Yup.string().max(64),
  post_code: Yup.string().max(16),
  country: Yup.string().max(64),
  ExternalIdentificationNumber: Yup.string()
    .matches(externalIdentificationFormat, { excludeEmptyString: true })
    .max(10),
  case_id: Yup.string().max(20).when('pas_provider', {
    is: 'medbridge',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  home_location: Yup.string().max(20).when('pas_provider', {
    is: 'medbridge',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  available_location_ids: Yup.array().of(Yup.string()),
  isPASPatient: Yup.boolean(),
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

export const createAppointmentValidationSchema = Yup.object().shape({
  patient: Yup.number().required(),
  doctor: Yup.number().required(),
  date: Yup.string().required(),
  time: Yup.string().required(),
  appointmentType: Yup.number().required(),
  price: Yup.number().required(),
});

export const createPASAppointmentValidationSchema = Yup.object().shape({
  patient: Yup.number().required(),
  date: Yup.string().required(),
  appointmentType: Yup.number().required(),
  time: Yup.string().required(),
});

export const updateAppointmentValidationSchema = Yup.object().shape({
  patient: Yup.number().required(),
  doctor: Yup.number().required(),
  date: Yup.string().required(),
  time: Yup.string().required(),
  appointmentType: Yup.number().required(),
  price: Yup.number().required(),
  status: Yup.number().required(),
});

export const endAppointmentSchema = Yup.object().shape({
  attended: Yup.boolean(),
  missing_reason: Yup.string().when('attended', {
    is: false,
    then: Yup.string().required(),
  }),
});

export const massInviteSchema = Yup.object().shape({
  ageFrom: Yup.number()
    .min(MASS_INVITE_MIN_AGE)
    .max(MASS_INVITE_MAX_AGE)
    .required(),
  ageTo: Yup.number()
    .min(MASS_INVITE_MIN_AGE)
    .max(MASS_INVITE_MAX_AGE)
    .moreThan(Yup.ref('ageFrom'))
    .required(),
  template: Yup.number().required(),
  appointmentType: Yup.number().required(),
  gender: Yup.array().min(1).required(),
});
