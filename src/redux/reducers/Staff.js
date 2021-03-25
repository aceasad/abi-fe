import {
  SET_STAFF,
  SET_STAFF_PAGE,
  SET_STAFF_LOADING,
  SET_STAFF_DETAILS,
  SET_STAFF_SINGLE,
} from '../constants/Staff';
import produce from 'immer';

const initialState = {
  staff: [],
  count: 0,
  page: 1,
  loading: true,
  ethnicities: [],
  specializations: [],
  seniorities: [],
  staffSingle: null,
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
    }
  });

export default staff;
