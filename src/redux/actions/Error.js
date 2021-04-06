import {
  SET_CLINIC_ERROR,
  SET_INTVALID_OLD_PASSWORD_ERROR,
} from 'redux/constants/Error';

export const setInvalidOldPasswordError = (payload) => {
  return {
    type: SET_INTVALID_OLD_PASSWORD_ERROR,
    payload,
  };
};

export const setClinicError = (payload) => {
  return {
    type: SET_CLINIC_ERROR,
    payload,
  };
};
