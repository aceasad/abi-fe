export const NO = 'NO';
export const FREE = 'FREE';
export const AVAILABLE = 'AVAILABLE';

export const MAX = '100';
export const NHS_MAX = '11'
export const baseState = {
  items: [],
  count: 0,
  page: 1,
  loading: true,
  field: '',
  order: '',
  search: '',
  single: null,
  next: null,
  patient_show_messages: null,
};
export const MAX_GOOGLE_LINK_LENGTH = 500;

export const MIN_PHONE_LENGTH = 10;
export const MAX_PHONE_LENGTH = 20;

export const SCHEDULED_APPOINTMENT = 'SCHEDULED_APPOINTMENT';
export const APPOINTMENT_HISTORY = 'APPOINTMENT_HISTORY';

export const FROM_STAFF_APPOINTMENTS = 'FROM_STAFF_APPOINTMENTS';
export const FROM_PATIENT_APPOINTMENTS = 'FROM_PATIENT_APPOINTMENTS';
export const FROM_OVERVIEW_APPOINTMENTS = 'FROM_OVERVIEW_APPOINTMENTS';
