import { produce } from 'immer';
import {
  SET_ANEMNESIS_LOADING,
  SET_MEDICAL_CONDITIONS,
  SET_PREVIOUS_OPERATIONS,
  SET_ANEMNESIS_PAGE,
  RESET_EXISTING_MEDICAL_CONDITION,
  APEND_OPERATION,
  APPEND_OPERATIONS,
  RESET_PREVIOUS_OPERATIONS,
  FILTER_OPERATION,
  FILTER_OPERATION_TYPE,
  APPEND_EXISTING_CONDITIONS,
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
          next: action.payload.next,
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
      case APPEND_EXISTING_CONDITIONS:
        draft[EXISTING_CONDITIONS] = {
          ...state[EXISTING_CONDITIONS],
          items: [
            ...state[EXISTING_CONDITIONS].items,
            ...action.payload.results.map((item) => {
              return {
                id: item.medical_condition_id,
                name: item.medical_condition,
              };
            }),
          ],
          next: action.payload.next,
        };
        break;
      case APEND_OPERATION:
        draft[PREVIOUS_OPERATIONS] = {
          ...state[PREVIOUS_OPERATIONS],
          items: [action.payload, ...state[PREVIOUS_OPERATIONS].items],
        };
        break;
      case APPEND_OPERATIONS:
        draft[PREVIOUS_OPERATIONS] = {
          ...state[PREVIOUS_OPERATIONS],
          items: [
            ...state[PREVIOUS_OPERATIONS].items,
            ...action.payload.results,
          ],
          next: action.payload.next,
        };
        break;
      case RESET_PREVIOUS_OPERATIONS:
        draft[PREVIOUS_OPERATIONS] = baseState;
        break;
      case FILTER_OPERATION:
        draft[PREVIOUS_OPERATIONS] = {
          ...draft[PREVIOUS_OPERATIONS],
          items: action.payload.key
            ? draft[PREVIOUS_OPERATIONS].items.filter(
                (item) => item.key !== action.payload.key
              )
            : draft[PREVIOUS_OPERATIONS].items.map((item) =>
                item.id === action.payload.id ? { ...item, hidden: true } : item
              ),
        };
        break;
      case FILTER_OPERATION_TYPE:
        draft[PREVIOUS_OPERATIONS] = {
          ...draft[PREVIOUS_OPERATIONS],
          items: draft[PREVIOUS_OPERATIONS].items.filter(
            (item) => item.operation_type_id !== action.payload
          ),
        };
    }
  });
export default anamnesis;
