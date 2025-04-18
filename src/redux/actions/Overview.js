import {
  GET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_SUMMARY_DATA_LOADING,
  SET_OVERVIEW_CLINICSTATS_DATA_LOADING,
  SET_OVERVIEW_CLINICSTATS_DATA,
  GET_OVERVIEW_CLINICSTATS_DATA,
} from 'redux/constants/Overview';

export const setOverviewLoading = (payload) => ({
  type: SET_OVERVIEW_SUMMARY_DATA_LOADING,
  payload,
});

export const setOverviewClinicStatsLoading = (payload) => ({
  type: SET_OVERVIEW_CLINICSTATS_DATA_LOADING,
  payload,
});

export const getOverviewData = (payload) => ({
  type: GET_OVERVIEW_SUMMARY_DATA,
  payload,
});

export const getOverviewClinicStatsData = (payload) => ({
  type: GET_OVERVIEW_CLINICSTATS_DATA,
  payload,
});

export const setOverviewData = (payload) => ({
  type: SET_OVERVIEW_SUMMARY_DATA,
  payload,
});

export const setOverviewClinicStatsData = (payload) => ({
  type: SET_OVERVIEW_CLINICSTATS_DATA,
  payload,
});
