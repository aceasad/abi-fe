import { SET_CLINIC_ERROR } from 'redux/constants/Error';

export const setClinicError = (payload) => {
  return {
    type: SET_CLINIC_ERROR,
    payload,
  };
};
