import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_DOCTOR_APPOINTMENTS,
  SET_IS_LOADING,
  GET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_DOCTORS,
  APPEND_TO_ALL_DOCTORS,
  SET_LOADING_DOCTORS,
  GET_APPOINTMENT_TYPES,
  GET_APPOINTMENT_STATUS,
  APPEND_TO_APPOINTMENT_TYPES,
  APPEND_TO_APPOINTMENT_STATUS,
  SET_APPOINTMENT_TYPES_LOADING,
  SET_APPOINTMENT_STATUS_LOADING,
  SET_PATIENTS,
  SEARCH_PATIENTS,
  DELETE_APPOINTEMNT,
  FILTER_DELETED_APPOINTMENT,
  END_APPOINTMENT,
  GET_MISSING_REASONS,
  SET_MISSING_REASONS,
  SET_ENDED_APPOINTMENT,
} from 'redux/constants/Appointment';

export const getDoctorAppointments = (payload) => ({
  type: GET_DOCTOR_APPOINTMENTS,
  payload,
});

export const setDoctorAppointments = (payload) => ({
  type: SET_DOCTOR_APPOINTMENTS,
  payload,
});

export const getDateAppointments = (payload) => ({
  type: GET_DATE_APPOINTMENTS,
  payload,
});

export const setDateAppointments = (payload) => ({
  type: SET_DATE_APPOINTMENTS,
  payload,
});

export const setAppointmentsLoading = (payload) => ({
  type: SET_IS_LOADING,
  payload,
});

export const getSignleAppointmnet = (payload) => ({
  type: GET_SINGLE_APPOINTMENT,
  payload,
});

export const setSignleAppointmnet = (payload) => ({
  type: SET_SINGLE_APPOINTMENT,
  payload,
});

export const setSignleAppointmnetLoading = (payload) => ({
  type: SET_SINGLE_APPOINTMENT_LOADING,
  payload,
});
export const createAppointment = (payload) => ({
  type: CREATE_APPOINTMENT,
  payload,
});

export const updateAppointment = (payload) => ({
  type: UPDATE_APPOINTMENT,
  payload,
});

export const getDoctors = (payload) => ({
  type: GET_DOCTORS,
  payload,
});

export const appendToAllDoctors = (payload) => ({
  type: APPEND_TO_ALL_DOCTORS,
  payload,
});

export const setDoctorsLoading = (payload) => ({
  type: SET_LOADING_DOCTORS,
  payload,
});

export const getAppointmentTypes = (payload) => ({
  type: GET_APPOINTMENT_TYPES,
  payload,
});

export const getAppointmentStatus = (payload) => ({
  type: GET_APPOINTMENT_STATUS,
  payload,
});

export const appendToAppointmentTypes = (payload) => ({
  type: APPEND_TO_APPOINTMENT_TYPES,
  payload,
});

export const appendToAppointmentStatus = (payload) => ({
  type: APPEND_TO_APPOINTMENT_STATUS,
  payload,
});

export const setAppointmentTypesLoading = (payload) => ({
  type: SET_APPOINTMENT_TYPES_LOADING,
  payload,
});

export const setAppointmentStatusLoading = (payload) => ({
  type: SET_APPOINTMENT_STATUS_LOADING,
  payload,
});

export const setPatients = (payload) => ({
  type: SET_PATIENTS,
  payload,
});

export const searchPatients = (payload) => ({
  type: SEARCH_PATIENTS,
  payload,
});

export const deleteAppointemnt = (payload) => ({
  type: DELETE_APPOINTEMNT,
  payload,
});

export const filterDeletedAppointment = (payload) => ({
  type: FILTER_DELETED_APPOINTMENT,
  payload,
});

export const endAppointemnt = (payload) => ({
  type: END_APPOINTMENT,
  payload,
});

export const getMissingReasons = () => ({
  type: GET_MISSING_REASONS,
});

export const setMissingReasons = (payload) => ({
  type: SET_MISSING_REASONS,
  payload,
});

export const setEndedAppointment = (payload) => ({
  type: SET_ENDED_APPOINTMENT,
  payload,
});
