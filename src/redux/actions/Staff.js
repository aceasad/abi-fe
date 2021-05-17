import {
  GET_STAFF,
  GET_STAFF_DETAILS,
  SET_STAFF,
  SET_STAFF_DETAILS,
  SET_STAFF_LOADING,
  SET_STAFF_PAGE,
  CREATE_STAFF,
  UPDATE_STAFF,
  GET_STAFF_SINGLE,
  SET_STAFF_SINGLE,
  DELTETE_STAFF,
  GET_STAFF_APPOINTMENTS,
  SET_STAFF_APPOINTMENTS,
  SET_STAFF_APPOINTMENTS_PAGE,
  SET_STAFF_APPOINTMENTS_LOADING,
  SET_STAFF_APPOINTMENTS_ORDER,
  SET_SCHEDULED_STAFF_APPOINTMENTS_PAGE,
  SET_PAST_STAFF_APPOINTMENTS_PAGE,
} from '../constants/Staff';

export const getStaff = () => ({
  type: GET_STAFF,
});

export const setStaff = (payload) => ({
  type: SET_STAFF,
  payload,
});

export const setStaffPage = (payload) => ({
  type: SET_STAFF_PAGE,
  payload,
});

export const setStaffLoading = (payload) => ({
  type: SET_STAFF_LOADING,
  payload,
});

export const getStaffDetails = () => ({
  type: GET_STAFF_DETAILS,
});

export const setStaffDetails = (payload) => ({
  type: SET_STAFF_DETAILS,
  payload,
});

export const createStaff = (payload) => ({
  type: CREATE_STAFF,
  payload,
});

export const updateStaff = (payload) => ({
  type: UPDATE_STAFF,
  payload,
});

export const getSingleStaff = (payload) => ({
  type: GET_STAFF_SINGLE,
  payload,
});

export const setSingleStaff = (payload) => ({
  type: SET_STAFF_SINGLE,
  payload,
});

export const deleteStaff = (payload) => ({
  type: DELTETE_STAFF,
  payload,
});

export const getAppointments = (payload) => ({
  type: GET_STAFF_APPOINTMENTS,
  payload,
});

export const setAppointments = (payload) => ({
  type: SET_STAFF_APPOINTMENTS,
  payload,
});

export const setAppointmentsPage = (payload) => ({
  type: SET_STAFF_APPOINTMENTS_PAGE,
  payload,
});

export const setAppointmentsLoading = (payload) => ({
  type: SET_STAFF_APPOINTMENTS_LOADING,
  payload,
});

export const setOrder = (payload) => ({
  type: SET_STAFF_APPOINTMENTS_ORDER,
  payload,
});

export const setScheduledStaffAppointmentsPage = (payload) => ({
  type: SET_SCHEDULED_STAFF_APPOINTMENTS_PAGE,
  payload,
});

export const setPastStaffAppointmentsPage = (payload) => ({
  type: SET_PAST_STAFF_APPOINTMENTS_PAGE,
  payload,
});
