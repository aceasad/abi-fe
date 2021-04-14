import {
  CREATE_APPOINTMENT,
  GET_AVAILABLE_TIMESLOTS,
  UPDATE_APPOINTMENT,
} from 'redux/constants/Appointment';

export const createAppointment = (payload) => {
  return {
    type: CREATE_APPOINTMENT,
    payload,
  };
};

export const updateAppointment = (payload) => {
  return {
    type: UPDATE_APPOINTMENT,
    payload,
  };
};

export const getAvailableTimeslots = (payload) => {
  return {
    type: GET_AVAILABLE_TIMESLOTS,
    payload,
  };
};
