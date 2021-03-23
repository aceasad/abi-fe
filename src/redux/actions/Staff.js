import { GET_STAFF, SET_STAFF } from '../constants/Staff';

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
