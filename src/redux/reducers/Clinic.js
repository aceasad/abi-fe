import {
  UPDATE_CLINIC_SUCCESS,
  UPDATE_CLINIC_ERROR,
} from '../constants/Clinic';
import produce from 'immer';
const initialState = { isUpdated: false, message: null };

const clinic = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_CLINIC_SUCCESS:
        draft.isUpdated = true;
        break;
      case UPDATE_CLINIC_ERROR:
        draft.message = action.message;
        break;
    }
  });
export default clinic;
