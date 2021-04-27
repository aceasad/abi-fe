import {
  GET_PREVIOUS_OPERATIONS,
  GET_MEDICAL_CONDITIONS,
  SET_MEDICAL_CONDITIONS,
  SET_PREVIOUS_OPERATIONS,
  SET_ANEMNESIS_LOADING,
  SET_ANEMNESIS_PAGE,
  CREATE_MEDICAL_CONDITION,
  DELETE_MEDICAL_CONDITION,
  RESET_EXISTING_MEDICAL_CONDITION,
  ADD_OPERATION_TYPE,
  APEND_OPERATION,
  APPEND_OPERATIONS,
  RESET_PREVIOUS_OPERATIONS,
  FILTER_OPERATION,
  DELETE_OPERATION_TYPE,
  FILTER_OPERATION_TYPE,
  APPEND_EXISTING_CONDITIONS,
} from 'redux/constants/Anemnesis';

export const getExistingMedicalConditions = (payload) => ({
  type: GET_MEDICAL_CONDITIONS,
  payload,
});

export const setExistingMedicalConditions = (payload) => ({
  type: SET_MEDICAL_CONDITIONS,
  payload,
});

export const getPreviousOperations = (payload) => ({
  type: GET_PREVIOUS_OPERATIONS,
  payload,
});

export const setPreviousOperations = (payload) => ({
  type: SET_PREVIOUS_OPERATIONS,
  payload,
});

export const setLoading = (payload) => ({
  type: SET_ANEMNESIS_LOADING,
  payload,
});

export const setPage = (payload) => ({
  type: SET_ANEMNESIS_PAGE,
  payload,
});

export const createMedicalCondition = (payload) => ({
  type: CREATE_MEDICAL_CONDITION,
  payload,
});

export const deleteMedicalCondition = (payload) => ({
  type: DELETE_MEDICAL_CONDITION,
  payload,
});

export const resetExistingMedicalConditions = () => ({
  type: RESET_EXISTING_MEDICAL_CONDITION,
});

export const addNewOperationType = (payload) => ({
  type: ADD_OPERATION_TYPE,
  payload,
});

export const appendOperation = (payload) => ({
  type: APEND_OPERATION,
  payload,
});

export const appendPreviousOperations = (payload) => ({
  type: APPEND_OPERATIONS,
  payload,
});

export const resetPreviousOperations = () => ({
  type: RESET_PREVIOUS_OPERATIONS,
});

export const filterOperation = (payload) => ({
  type: FILTER_OPERATION,
  payload,
});

export const deleteOperationTypeFromOrganization = (payload) => ({
  type: DELETE_OPERATION_TYPE,
  payload,
});

export const filterOperationType = (payload) => ({
  type: FILTER_OPERATION_TYPE,
  payload,
});

export const appendExistingConditions = (payload) => ({
  type: APPEND_EXISTING_CONDITIONS,
  payload,
});
