import {
  SET_STAFF,
  SET_STAFF_PAGE,
  SET_STAFF_LOADING,
  SET_STAFF_DETAILS,
  SET_STAFF_SINGLE,
  SET_STAFF_APPOINTMENTS,
  SET_STAFF_APPOINTMENTS_PAGE,
  SET_STAFF_APPOINTMENTS_LOADING,
  SET_STAFF_APPOINTMENTS_ORDER,
} from '../constants/Staff';
import produce from 'immer';
import { baseState } from 'constants/ClinicConstants';

export const SCHEDULED = 'scheduled';
export const HISTORY = 'history';
export const LIKELY_TO_BE_MISSED = 'likely_to_be_missed';

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
  [LIKELY_TO_BE_MISSED]: baseState,
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
      case SET_STAFF_APPOINTMENTS:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          items: action.payload.results,
          count: action.payload.count,
        };
        break;
      case SET_STAFF_APPOINTMENTS_PAGE:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          page: action.payload.page,
        };
        break;
      case SET_STAFF_APPOINTMENTS_LOADING:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          loading: action.payload.loading,
        };
        break;
      case SET_STAFF_APPOINTMENTS_ORDER:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          field: action.payload.order ? action.payload.sort_field : '',
          order: action.payload.order || '',
        };
        break;
    }
  });

export default staff;
