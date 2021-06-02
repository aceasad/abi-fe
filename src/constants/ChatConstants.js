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
};
