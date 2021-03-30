import produce from 'immer';
import {
  SET_PATIENTS,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_PAGE,
  SET_PATIENT_SEARCH,
} from 'redux/constants/Patient';

const initialState = {
  patients: [],
  count: 0,
  page: 1,
  loading: true,
  field: '',
  order: '',
  search: '',
};

/* eslint-disable default-case */
const patient = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PATIENTS:
        draft.patients = action.payload.results;
        draft.count = action.payload.count;
        break;
      case SET_PATIENT_PAGE:
        draft.page = action.payload;
        break;
      case SET_PATIENT_LOADING:
        draft.loading = action.payload;
        break;
      case SET_PATIENT_ORDER:
        draft.field = action.payload.order ? action.payload.field : '';
        draft.order = action.payload.order || '';
        break;
      case SET_PATIENT_SEARCH:
        draft.search = action.payload;
        break;
    }
  });
export default patient;
