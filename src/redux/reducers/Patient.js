import produce from 'immer';
import {
  SET_PATIENTS,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_PAGE,
  SET_PATIENT_SEARCH,
  SET_PATIENT_DETAILS,
  SET_PATIENT_SINGLE,
  MODIFY_PATIENT,
} from 'redux/constants/Patient';

const initialState = {
  patients: [],
  count: 0,
  page: 1,
  loading: true,
  field: '',
  order: '',
  search: '',
  education: [],
  employment: [],
  material_status: [],
  ethnicities: [],
  singlePatient: null,
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
      case SET_PATIENT_DETAILS:
        draft.education = action.payload.education;
        draft.employment = action.payload.employment;
        draft.material_status = action.payload.material_status;
        draft.ethnicities = action.payload.ethnicities;
        break;
      case SET_PATIENT_SINGLE:
        draft.singlePatient = action.payload;
        break;
      case MODIFY_PATIENT:
        draft.patients = state.patients.map((patient) =>
          patient.id === action.payload.id
            ? { ...patient, ...action.payload }
            : patient
        );
        break;
    }
  });
export default patient;
