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
} from '../constants/Staff';

export const getStaff = () => {
  return {
    type: GET_STAFF,
  };
};

export const setStaff = (payload) => {
  return {
    type: SET_STAFF,
    payload,
  };
};

export const setStaffPage = (payload) => {
  return {
    type: SET_STAFF_PAGE,
    payload,
  };
};

export const setStaffLoading = (payload) => {
  return {
    type: SET_STAFF_LOADING,
    payload,
  };
};

export const getStaffDetails = () => {
  return {
    type: GET_STAFF_DETAILS,
  };
};

export const setStaffDetails = (payload) => {
  return {
    type: SET_STAFF_DETAILS,
    payload,
  };
};

export const createStaff = (payload) => {
  return {
    type: CREATE_STAFF,
    payload,
  };
};

export const updateStaff = (payload) => {
  return {
    type: UPDATE_STAFF,
    payload,
  };
};

export const getSingleStaff = (payload) => {
  return {
    type: GET_STAFF_SINGLE,
    payload,
  };
};

export const setSingleStaff = (payload) => {
  return {
    type: SET_STAFF_SINGLE,
    payload,
  };
};

export const deleteStaff = (payload) => {
  return {
    type: DELTETE_STAFF,
    payload,
  };
};
