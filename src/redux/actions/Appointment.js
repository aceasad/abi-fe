import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_DOCTOR_APPOINTMENTS,
  SET_IS_LOADING,
  GET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
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
