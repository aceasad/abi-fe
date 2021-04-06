import {
  CREATE_CLINIC,
  CREATE_CLINIC_SUCCESS,
  CREATE_CLINIC_ERROR,
  UPDATE_CLINIC,
  GET_CLINIC,
  SET_CLINIC,
  GET_IS_LOADING,
  SET_IS_LOADING,
} from '../constants/Clinic';

export const createClinic = (payload) => {
  return {
    type: CREATE_CLINIC,
    payload,
  };
};

export const createClinicSuccess = (payload) => {
  return {
    type: CREATE_CLINIC_SUCCESS,
    payload,
  };
};

export const createClinicError = (payload) => {
  return {
    type: CREATE_CLINIC_ERROR,
    payload,
  };
};

export const updateClinic = (payload) => {
  return {
    type: UPDATE_CLINIC,
    payload,
  };
};

export const getClinic = () => {
  return {
    type: GET_CLINIC,
  };
};

export const setClinic = (payload) => {
  return {
    type: SET_CLINIC,
    payload,
  };
};

export const getIsLoading = () => {
  return {
    type: GET_IS_LOADING,
  };
};

export const setIsLoading = (payload) => {
  return {
    type: SET_IS_LOADING,
    payload,
  };
};
