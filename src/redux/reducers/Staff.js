import {
  SET_STAFF,
  SET_STAFF_PAGE,
  SET_STAFF_LOADING,
  SET_STAFF_DETAILS,
  SET_STAFF_SINGLE,
  SET_APPOINTMENTS,
  SET_APPOINTMENTS_PAGE,
  SET_APPOINTMENTS_LOADING,
  SET_APPOINTMENTS_ORDER,
  SET_APPOINTMENTS_REMINDERS,
  SET_APPOINTMENTS_REMINDERS_PAGE,
  SET_APPOINTMENTS_REMINDERS_LOADING,
  SET_APPOINTMENTS_REMINDERS_ORDER,
  SET_APPOINTMENTS_REMINDERS_SEARCH,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_LOADING,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_ORDER,
} from '../constants/Staff';
import { produce } from 'immer';
import { baseState } from 'constants/ClinicConstants';
import { MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE_SIZE } from 'constants/ApiConstant';

export const SCHEDULED = 'scheduled_appointments';
export const HISTORY = 'history_appointments';
export const HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE =
  'history_appointments_requiring_immediate_status_update';
export const LIKELY_TO_BE_MISSED = 'likely_to_be_missed_appointments';
export const UPCOMING_REMINDERS_APPOINTMENT =
  'upcoming_appointments_reminders_appointment';
export const UPCOMING_REMINDERS_SYSTEM =
  'upcoming_appointments_reminders_system';
export const MESSAGES_REQUIRING_IMMEDIATE_ATTENTION =
  'messages_requiring_immediate_attention';

const initialState = {
  staff: [],
  count: 0,
  page: 1,
  loading: true,
  ethnicities: [],
  specializations: [],
  seniorities: [],
  staffSingle: null,
  [SCHEDULED]: baseState,
  [HISTORY]: baseState,
  [HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE]: baseState,
  [LIKELY_TO_BE_MISSED]: baseState,
  [UPCOMING_REMINDERS_APPOINTMENT]: baseState,
  [UPCOMING_REMINDERS_SYSTEM]: baseState,
  [MESSAGES_REQUIRING_IMMEDIATE_ATTENTION]: {
    ...baseState,
    pageSize: MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE_SIZE,
  },
};

/* eslint-disable default-case */
const staff = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STAFF:
        draft.staff = action.payload.results;
        draft.count = action.payload.count;
        break;
      case SET_STAFF_PAGE:
        draft.page = action.payload;
        break;
      case SET_STAFF_LOADING:
        draft.loading = action.payload;
        break;
      case SET_STAFF_DETAILS:
        draft.ethnicities = action.payload.ethnicities;
        draft.seniorities = action.payload.seniorities;
        draft.specializations = action.payload.specializations;
        break;
      case SET_STAFF_SINGLE:
        draft.staffSingle = action.payload;
        break;
      // appointments
      case SET_APPOINTMENTS:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          items: action.payload.results,
          count: action.payload.count,
        };
        break;
      case SET_APPOINTMENTS_PAGE:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          page: action.payload.page,
        };
        break;
      case SET_APPOINTMENTS_LOADING:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          loading: action.payload.loading,
        };
        break;
      case SET_APPOINTMENTS_ORDER:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          field: action.payload.order ? action.payload.sort_field : '',
          order: action.payload.order || '',
        };
        break;
      // appointments reminders
      case SET_APPOINTMENTS_REMINDERS:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          items: action.payload.results,
          count: action.payload.count,
        };
        break;
      case SET_APPOINTMENTS_REMINDERS_PAGE:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          page: action.payload.page,
        };
        break;
      case SET_APPOINTMENTS_REMINDERS_LOADING:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          loading: action.payload.loading,
        };
        break;
      case SET_APPOINTMENTS_REMINDERS_ORDER:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          field: action.payload.order ? action.payload.sort_field : '',
          order: action.payload.order || '',
        };
        break;
      case SET_APPOINTMENTS_REMINDERS_SEARCH: {
        const search = action.payload.search || '';
        [UPCOMING_REMINDERS_APPOINTMENT, UPCOMING_REMINDERS_SYSTEM].forEach(
          (field) => {
            draft[field] = {
              ...state[field],
              search,
              page: 1,
            };
          }
        );
        break;
      }
      // Human intervention needed
      case SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          items: action.payload.results,
          count: action.payload.count,
        };
        break;
      case SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          page: action.payload.page,
          ...(action.payload.pageSize != null
            ? { pageSize: action.payload.pageSize }
            : {}),
        };
        break;
      case SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_LOADING:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          loading: action.payload.loading,
        };
        break;
      case SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_ORDER:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          field: action.payload.order ? action.payload.sort_field : '',
          order: action.payload.order || '',
        };
        break;
    }
  });

export default staff;
