import { produce } from 'immer';
import { SET_CLINIC_ERROR } from 'redux/constants/Error';

const initState = {
  clinicError: '',
};

/* eslint-disable default-case */
const error = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CLINIC_ERROR:
        draft.clinicError = action.payload;
        break;
    }
  });

export default error;
