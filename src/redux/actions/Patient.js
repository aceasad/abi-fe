import {
  GET_PATIENTS,
  SET_PATIENTS,
  SET_PATIENT_PAGE,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_SEARCH,
} from '../constants/Patient';

export const getPatients = () => {
  return {
    type: GET_PATIENTS,
  };
};

export const setPatients = (payload) => {
  return {
    type: SET_PATIENTS,
    payload,
  };
};

export const setPatientPage = (payload) => {
  return {
    type: SET_PATIENT_PAGE,
    payload,
  };
};

export const setPatientLoading = (payload) => {
  return {
    type: SET_PATIENT_LOADING,
    payload,
  };
};

export const setOrder = (payload) => {
  return {
    type: SET_PATIENT_ORDER,
    payload,
  };
};

export const setPatientSearch = (payload) => {
  return {
    type: SET_PATIENT_SEARCH,
    payload,
  };
};
