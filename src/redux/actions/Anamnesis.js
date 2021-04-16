import {
  GET_PREVIOUS_OPERATIONS,
  GET_MEDICAL_CONDITIONS,
  SET_MEDICAL_CONDITIONS,
  SET_PREVIOUS_OPERATIONS,
  SET_ANEMNESIS_LOADING,
  SET_ANEMNESIS_PAGE,
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
