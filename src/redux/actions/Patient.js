import {
  GET_PATIENTS,
  SET_PATIENTS,
  SET_PATIENT_PAGE,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_SEARCH,
  DELETE_PATIENT,
} from '../constants/Patient';

export const getPatients = () => ({
  type: GET_PATIENTS,
});

export const setPatients = (payload) => ({
  type: SET_PATIENTS,
  payload,
});

export const setPatientPage = (payload) => ({
  type: SET_PATIENT_PAGE,
  payload,
});

export const setPatientLoading = (payload) => ({
  type: SET_PATIENT_LOADING,
  payload,
});

export const setOrder = (payload) => ({
  type: SET_PATIENT_ORDER,
  payload,
});

export const setPatientSearch = (payload) => ({
  type: SET_PATIENT_SEARCH,
  payload,
});

export const deletePatient = (payload) => ({
  type: DELETE_PATIENT,
  payload,
});
