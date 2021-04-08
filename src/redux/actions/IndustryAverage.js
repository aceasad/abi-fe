import {
  GET_INDUSTRY_AVERAGE_ERROR,
  GET_INDUSTRY_AVERAGE_SUCCESS,
  GET_INDUSTRY_AVERAGE,
  UPDATED_INDUSTRY_AVERAGE,
  UPDATED_INDUSTRY_AVERAGE_ERROR,
  UPDATED_INDUSTRY_AVERAGE_SUCCESS,
  SET_LOADING,
  CREATED_INDUSTRY_AVERAGE,
  CREATED_INDUSTRY_AVERAGE_SUCCESS,
  CREATED_INDUSTRY_AVERAGE_ERROR,
  UPDATE_IS_UPDATED,
} from '../constants/IndustryAverage';

export const updateIndustryAverage = (values) => {
  return {
    type: UPDATED_INDUSTRY_AVERAGE,
    values,
  };
};

export const updateIndustryAverageSuccess = (response) => {
  return {
    type: UPDATED_INDUSTRY_AVERAGE_SUCCESS,
    response,
  };
};

export const updateIndustryAverageError = (message) => {
  return {
    type: UPDATED_INDUSTRY_AVERAGE_ERROR,
    message,
  };
};

export const createIndustryAverageSuccess = (response) => {
  return {
    type: CREATED_INDUSTRY_AVERAGE_SUCCESS,
    response,
  };
};

export const createIndustryAverageError = (message) => {
  return {
    type: CREATED_INDUSTRY_AVERAGE_ERROR,
    message,
  };
};

export const createIndustryAverage = (values) => {
  return {
    type: CREATED_INDUSTRY_AVERAGE,
    values,
  };
};

export const getIndustryAverage = () => {
  return {
    type: GET_INDUSTRY_AVERAGE,
  };
};

export const getIndustryAverageSuccess = (industryAverage) => {
  return {
    type: GET_INDUSTRY_AVERAGE_SUCCESS,
    industryAverage,
  };
};

export const getIndustryAverageError = (message) => {
  return {
    type: GET_INDUSTRY_AVERAGE_ERROR,
    message,
  };
};

export const setLoading = (flag) => {
  return {
    type: SET_LOADING,
    flag,
  };
};

export const updateIsUpdated = () => {
  return {
    type: UPDATE_IS_UPDATED,
  };
};
