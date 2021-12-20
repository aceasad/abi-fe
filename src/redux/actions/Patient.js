import {
  GET_PATIENTS,
  SET_PATIENTS,
  SET_PATIENT_PAGE,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_SEARCH,
  DELETE_PATIENT,
  GET_PATIENTS_DETAILS,
  SET_PATIENT_DETAILS,
  CREATE_PATIENT,
  GET_PATIENT_SINGLE,
  SET_PATIENT_SINGLE,
  UPDATE_PATIENT,
  MODIFY_PATIENT,
  GET_PATIENT_OVERVIEW,
  SET_SCHEDULED_APPOINTMENTS_LOADING,
  SET_APPOINTMENT_HISTORY_LOADING,
  SET_SCHEDULED_APPOINTMENTS,
  SET_APPOINTMENT_HISTORY,
  SET_SCHEDULED_PAGE,
  SET_SCHEDULED_ORDER,
  SET_HISTORY_PAGE,
  CHANGE_PATIENT,
  TOGGLE_PATIENT_WHITELIST,
  GET_SCHEDULED_APPOINTMENTS,
  GET_APPOINTMENT_HISTORY,
  MARK_CONVERSATION_HUMAN_NOT_REQUIRED,
  SET_PATIENT_SHOW_MESSAGES,
  CLEAR_PATIENT_SHOW_MESSAGES,
} from '../constants/Patient';

export const getPatients = () => ({
  type: GET_PATIENTS,
});

export const setPatients = (payload) => ({
  type: SET_PATIENTS,
  payload,
});

export const setPatientPage = (payload) => ({
  type: SET_PATIENT_PAGE,
  payload,
});

export const setPatientLoading = (payload) => ({
  type: SET_PATIENT_LOADING,
  payload,
});

export const setOrder = (payload) => ({
  type: SET_PATIENT_ORDER,
  payload,
});

export const setPatientSearch = (payload) => ({
  type: SET_PATIENT_SEARCH,
  payload,
});

export const deletePatient = (payload) => ({
  type: DELETE_PATIENT,
  payload,
});

export const getPatientDetails = () => ({
  type: GET_PATIENTS_DETAILS,
});

export const setPatientDetails = (payload) => ({
  type: SET_PATIENT_DETAILS,
  payload,
});

export const createPatient = (payload) => ({
  type: CREATE_PATIENT,
  payload,
});

export const getSinglePatient = (payload) => ({
  type: GET_PATIENT_SINGLE,
  payload,
});

export const setSinglePatient = (payload) => ({
  type: SET_PATIENT_SINGLE,
  payload,
});

export const editPatient = (payload) => ({
  type: UPDATE_PATIENT,
  payload,
});

export const modifyPatient = (payload) => ({
  type: MODIFY_PATIENT,
  payload,
});

export const getPatientOverview = (payload) => ({
  type: GET_PATIENT_OVERVIEW,
  payload,
});

export const setScheduledAppointmentsLoading = (payload) => ({
  type: SET_SCHEDULED_APPOINTMENTS_LOADING,
  payload,
});

export const setAppointmentHistoryLoading = (payload) => ({
  type: SET_APPOINTMENT_HISTORY_LOADING,
  payload,
});

export const setScheduledAppointments = (payload) => ({
  type: SET_SCHEDULED_APPOINTMENTS,
  payload,
});

export const setAppointmentHistory = (payload) => ({
  type: SET_APPOINTMENT_HISTORY,
  payload,
});

export const setScheduledPage = (payload) => ({
  type: SET_SCHEDULED_PAGE,
  payload,
});

export const setScheduledOrder = (payload) => ({
  type: SET_SCHEDULED_ORDER,
  payload,
});

export const setAppointmentHistoryPage = (payload) => ({
  type: SET_HISTORY_PAGE,
  payload,
});

export const changePatient = (payload) => ({
  type: CHANGE_PATIENT,
  payload,
});

export const togglePatientWhitelist = () => ({
  type: TOGGLE_PATIENT_WHITELIST,
});

export const getScheduledAppointments = (payload) => ({
  type: GET_SCHEDULED_APPOINTMENTS,
  payload,
});

export const getAppointmentHistory = (payload) => ({
  type: GET_APPOINTMENT_HISTORY,
  payload,
});

export const markConversationHumanNotRequired = (payload) => ({
  type: MARK_CONVERSATION_HUMAN_NOT_REQUIRED,
  payload,
});

export const setPatientShowMessages = (payload) => ({
  type: SET_PATIENT_SHOW_MESSAGES,
  payload,
});

export const clearPatientShowMessages = () => ({
  type: CLEAR_PATIENT_SHOW_MESSAGES,
});
