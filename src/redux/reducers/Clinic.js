import {
  CREATE_CLINIC_SUCCESS,
  CREATE_CLINIC_ERROR,
  SET_CLINIC,
  SET_IS_LOADING,
} from '../constants/Clinic';
import { produce } from 'immer';
const initialState = {
  isCreated: false,
  message: null,
  clinic: null,
  loading: false,
};

const clinic = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CREATE_CLINIC_SUCCESS:
        draft.isCreated = true;
        break;
      case CREATE_CLINIC_ERROR:
        draft.message = action.message;
        break;
      case SET_CLINIC:
        draft.clinic = action.payload;
        break;
      case SET_IS_LOADING:
        draft.loading = action.payload;
        break;
    }
  });
export default clinic;
