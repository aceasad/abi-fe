export const MESSAGE_TYPE = {
  DATE: 'date',
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  DIVIDER: 'DIVIDER',
};

export const MESSAGE_FROM = {
  OPPOSITE: 'opposite',
  ME: 'me',
};

export const MESSAGE_STATUS = {
  SENT: 'SENT',
  READ: 'READ',
};

export const MESSAGE_ROLE = {
  ASA: 'ASA',
  SYSTEM: 'SYSTEM',
  STAFF: 'STAFF',
  PATIENT: 'PATIENT',
};

export const chatBaseState = {
  items: [],
  count: 0,
  page: 1,
  loading: true,
  field: '',
  order: '',
  search: '',
  single: null,
  next: null,
  offset: 0,
  scrollDown: true,
  triggerSearchConversations: null,
};

export const MASS_INVITE_MIN_AGE = 18;
export const MASS_INVITE_MAX_AGE = 100;

export const CHAT_FILTERS = {
  BOOKED: 'BOOKED',
  RESCHEDULED: 'RESCHEDULED',
  CANCELLED: 'CANCELLED',
  ASKED_QUESTION: 'ASKED_QUESTION',
  NO_RESPONSE: 'NO_RESPONSE',
  HUMAN_INTERVENTION_REQUIRED: 'human_intervention_required',
  IN_EMERGENCY_SITUATION: 'in_emergency_situation',
  DECLINED: 'DECLINED',
  SCREENED_ELSEWHERE: 'SCREENED_ELSEWHERE',
  INCOMPLETE: 'INCOMPLETE',
  INVITED: 'INVITED',
  REMINDED: 'REMINDED',
  SNOOZED: 'SNOOZED',
  FAILED: 'FAILED',
  // LIKELY_TO_MISS_NEXT_APPOINTMENT: 'likely_to_miss_next_appointment',
  ALL: 'all',
};

export const FILTER_ATTRIBUTES = {
  STATUS: 'status',
  LOCATION: 'location',
};

export const getPatientLocationDescription = (homeLocation) => {
  if (!homeLocation || typeof homeLocation !== 'object') {
    return null;
  }
  return homeLocation.location_description || homeLocation.location_name || null;
};

export const buildPatientLocationFilterOptions = (conversations) => {
  const descriptions = new Set();
  for (const item of conversations) {
    const description = getPatientLocationDescription(item?.patient?.home_location);
    if (description) {
      descriptions.add(description);
    }
  }
  return Array.from(descriptions)
    .sort((a, b) => a.localeCompare(b))
    .map((description) => ({ value: description, label: description }));
};
