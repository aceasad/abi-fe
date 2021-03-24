import {
  GET_STAFF,
  SET_STAFF,
  SET_STAFF_LOADING,
  SET_STAFF_PAGE,
} from '../constants/Staff';

export function getStaff() {
  return {
    type: GET_STAFF,
  };
}

export function setStaff(payload) {
  return {
    type: SET_STAFF,
    payload,
  };
}

export function setStaffPage(payload) {
  return {
    type: SET_STAFF_PAGE,
    payload,
  };
}

export function setStaffLoading(payload) {
  return {
    type: SET_STAFF_LOADING,
    payload,
  };
}
