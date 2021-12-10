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
  HUMAN_INTERVENTION_REQUIRED: 'human_intervention_required',
  LIKELY_TO_MISS_NEXT_APPOINTMENT: 'likely_to_miss_next_appointment',
  ALL: 'all',
};
