import {
  GET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_SUMMARY_DATA_LOADING,
} from 'redux/constants/Overview';

export const setOverviewLoading = (payload) => ({
  type: SET_OVERVIEW_SUMMARY_DATA_LOADING,
  payload,
});

export const getOverviewData = (payload) => ({
  type: GET_OVERVIEW_SUMMARY_DATA,
  payload,
});

export const setOverviewData = (payload) => ({
  type: SET_OVERVIEW_SUMMARY_DATA,
  payload,
});
