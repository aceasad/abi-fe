import { baseState } from 'constants/ClinicConstants';
import { produce } from 'immer';
import {
  SET_PATIENTS,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_PAGE,
  SET_PATIENT_SEARCH,
  SET_PATIENT_DETAILS,
  SET_PATIENT_DETAILS_NEW_PATIENT_FORM,
  SET_PATIENT_SINGLE,
  MODIFY_PATIENT,
  SET_APPOINTMENT_HISTORY_LOADING,
  SET_SCHEDULED_APPOINTMENTS_LOADING,
  SET_APPOINTMENT_HISTORY,
  SET_SCHEDULED_APPOINTMENTS,
  SET_SCHEDULED_PAGE,
  SET_SCHEDULED_ORDER,
  SET_HISTORY_PAGE,
  TOGGLE_PATIENT_WHITELIST,
  SET_PATIENT_SHOW_MESSAGES,
  CLEAR_PATIENT_SHOW_MESSAGES,
} from 'redux/constants/Patient';

const initialState = {
  patients: { ...baseState },
  education: [],
  employment: [],
  material_status: [],
  ethnicities: [],
  scheduledAppointments: { ...baseState },
  appointmentHistory: { ...baseState },
};

/* eslint-disable default-case */
const patient = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PATIENTS:
        draft.patients = {
          ...state.patients,
          items: action.payload.results,
          count: action.payload.count,
        };
        break;
      case SET_PATIENT_PAGE:
        draft.patients = { ...state.patients, page: action.payload };
        break;
      case SET_PATIENT_LOADING:
        draft.patients = { ...state.patients, loading: action.payload };
        break;
      case SET_PATIENT_ORDER:
        draft.patients = {
          ...state.patients,
          field: action.payload.order ? action.payload.field : '',
          order: action.payload.order || '',
        };
        break;
      case SET_PATIENT_SEARCH:
        draft.patients = {
          ...state.patients,
          page: 1,
          search: action.payload,
        };
        break;
      // Check if this is needed
      case SET_PATIENT_DETAILS:
        draft.education = action.payload.education;
        draft.employment = action.payload.employment;
        draft.material_status = action.payload.material_status;
        draft.ethnicities = action.payload.ethnicities;
        break;
      case SET_PATIENT_DETAILS_NEW_PATIENT_FORM:
        draft.education = action.payload.education;
        draft.employment = action.payload.employment;
        draft.material_status = action.payload.material_status;
        draft.ethnicities = action.payload.ethnicities;
        break;
      case SET_PATIENT_SINGLE:
        draft.patients = { ...state.patients, single: action.payload };
        break;
      case MODIFY_PATIENT:
        draft.patients = {
          ...state.patients,
          items: state.patients.items.map((patient) =>
            patient.id === action.payload.id
              ? { ...patient, ...action.payload }
              : patient
          ),
        };
        break;
      case SET_APPOINTMENT_HISTORY_LOADING:
        draft.appointmentHistory = {
          ...state.appointmentHistory,
          loading: action.payload,
        };
        break;
      case SET_SCHEDULED_APPOINTMENTS_LOADING:
        draft.scheduledAppointments = {
          ...state.scheduledAppointments,
          loading: action.payload,
        };
        break;
      case SET_APPOINTMENT_HISTORY:
        draft.appointmentHistory = {
          ...state.appointmentHistory,
          count: action.payload.count,
          items: action.payload.results,
        };
        break;
      case SET_SCHEDULED_APPOINTMENTS:
        draft.scheduledAppointments = {
          ...state.scheduledAppointments,
          count: action.payload.count,
          items: action.payload.results,
        };
        break;
      case SET_SCHEDULED_PAGE:
        draft.scheduledAppointments = {
          ...state.scheduledAppointments,
          page: action.payload.page,
        };
        break;
      case SET_SCHEDULED_ORDER:
        draft.scheduledAppointments = {
          ...state.scheduledAppointments,
          field: action.payload.order ? action.payload.field : '',
          order: action.payload.order || '',
        };
        break;
      case SET_HISTORY_PAGE:
        draft.appointmentHistory = {
          ...state.appointmentHistory,
          page: action.payload.page,
        };
        break;
      case TOGGLE_PATIENT_WHITELIST:
        draft.patients = {
          ...state.patients,
          single: {
            ...state.patients.single,
            whitelisted: !state.patients.single.whitelisted,
          },
        };
        break;
      case SET_PATIENT_SHOW_MESSAGES: {
        draft.patients = {
          ...state.patients,
          patient_show_messages: action.payload,
        };
        break;
      }
      case CLEAR_PATIENT_SHOW_MESSAGES: {
        draft.patients = {
          ...state.patients,
          patient_show_messages: null,
        };
        break;
      }
    }
  });
export default patient;
