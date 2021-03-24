import {
  GET_STAFF,
  SET_STAFF,
  SET_STAFF_LOADING,
  SET_STAFF_PAGE,
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
