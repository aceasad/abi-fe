import { SET_INTVALID_OLD_PASSWORD_ERROR } from 'redux/constants/Error';

export const setInvalidOldPasswordError = (payload) => {
  return {
    type: SET_INTVALID_OLD_PASSWORD_ERROR,
    payload,
  };
};
