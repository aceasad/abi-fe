import {
  GET_PATIENTS,
  SET_PATIENTS,
  SET_PATIENT_PAGE,
  SET_PATIENT_LOADING,
  SET_PATIENT_ORDER,
  SET_PATIENT_SEARCH,
  DELETE_PATIENT,
  GET_PATIENTS_DETAILS,
  SET_PATIENT_DETAILS,
  CREATE_PATIENT,
  GET_PATIENT_SINGLE,
  SET_PATIENT_SINGLE,
  UPDATE_PATIENT,
  MODIFY_PATIENT,
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

export const getPatientDetails = () => ({
  type: GET_PATIENTS_DETAILS,
});

export const setPatientDetails = (payload) => ({
  type: SET_PATIENT_DETAILS,
  payload,
});

export const createPatient = (payload) => ({
  type: CREATE_PATIENT,
  payload,
});

export const getSinglePatient = (payload) => ({
  type: GET_PATIENT_SINGLE,
  payload,
});

export const setSinglePatient = (payload) => ({
  type: SET_PATIENT_SINGLE,
  payload,
});

export const editPatient = (payload) => ({
  type: UPDATE_PATIENT,
  payload,
});

export const modifyPatient = (payload) => ({
  type: MODIFY_PATIENT,
  payload,
});
