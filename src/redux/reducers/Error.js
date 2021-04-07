import produce from 'immer';
import {
  SET_INTVALID_OLD_PASSWORD_ERROR,
  SET_CLINIC_ERROR,
} from 'redux/constants/Error';

const initState = {
  invalidOldPasswordError: false,
  clinicError: '',
};

/* eslint-disable default-case */
const error = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_INTVALID_OLD_PASSWORD_ERROR:
        draft.invalidOldPasswordError = action.payload;
        break;
      case SET_CLINIC_ERROR:
        draft.clinicError = action.payload;
        break;
    }
  });

export default error;
