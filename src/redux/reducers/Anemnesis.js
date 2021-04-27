import produce from 'immer';
import {
  SET_ANEMNESIS_LOADING,
  SET_MEDICAL_CONDITIONS,
  SET_PREVIOUS_OPERATIONS,
  SET_ANEMNESIS_PAGE,
  RESET_EXISTING_MEDICAL_CONDITION,
} from 'redux/constants/Anemnesis';
import { baseState } from 'constants/ClinicConstants';

export const EXISTING_CONDITIONS = 'existingMedicalConditions';
export const PREVIOUS_OPERATIONS = 'previousOperations';

const initialState = {
  [EXISTING_CONDITIONS]: baseState,
  [PREVIOUS_OPERATIONS]: baseState,
};

const anamnesis = (state = initialState, action) =>
  produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case SET_ANEMNESIS_LOADING:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          loading: action.payload.loading,
        };
        break;
      case SET_MEDICAL_CONDITIONS:
        draft[EXISTING_CONDITIONS] = {
          ...state[EXISTING_CONDITIONS],
          items: action.payload.results.map((item) => {
            return {
              id: item.medical_condition_id,
              name: item.medical_condition,
            };
          }),
          count: action.payload.count,
        };
        break;
      case SET_PREVIOUS_OPERATIONS:
        draft[PREVIOUS_OPERATIONS] = {
          ...state[PREVIOUS_OPERATIONS],
          items: action.payload.results,
          count: action.payload.count,
        };
        break;
      case SET_ANEMNESIS_PAGE:
        draft[action.payload.field] = {
          ...state[action.payload.field],
          page: action.payload.page,
        };
        break;
      case RESET_EXISTING_MEDICAL_CONDITION:
        draft[EXISTING_CONDITIONS] = baseState;
        break;
    }
  });
export default anamnesis;
