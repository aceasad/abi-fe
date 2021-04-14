import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_DOCTOR_APPOINTMENTS,
  SET_IS_LOADING,
  GET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
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
