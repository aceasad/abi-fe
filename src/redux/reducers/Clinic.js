import {
  UPDATE_CLINIC,
  UPDATE_CLINIC_SUCCESS,
  UPDATE_CLINIC_ERROR,
} from "../constants/Clinic";

const initialState = { isUpdated: false, message: null };

const clinic = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CLINIC: {
      return { ...state };
    }
    case UPDATE_CLINIC_SUCCESS: {
      return { ...state, isUpdated: true };
    }
    case UPDATE_CLINIC_ERROR: {
      return { ...state, message: action.message };
    }
    default:
      return state;
  }
};
export default clinic;
