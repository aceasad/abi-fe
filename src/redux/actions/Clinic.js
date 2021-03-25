import {
  UPDATE_CLINIC,
  UPDATE_CLINIC_SUCCESS,
  UPDATE_CLINIC_ERROR,
} from "../constants/Clinic";

export const updateClinic = (values) => {
  return {
    type: UPDATE_CLINIC,
    values,
  };
};

export const updateClinicSuccess = (response) => {
  return {
    type: UPDATE_CLINIC_SUCCESS,
    response,
  };
};

export const updateClinicError = (message) => {
  return {
    type: UPDATE_CLINIC_ERROR,
    message,
  };
};
