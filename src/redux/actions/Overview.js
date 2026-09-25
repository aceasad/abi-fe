import {
  GET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_SUMMARY_DATA_LOADING,
  SET_OVERVIEW_CLINICSTATS_DATA_LOADING,
  SET_OVERVIEW_CLINICSTATS_DATA,
  GET_OVERVIEW_CLINICSTATS_DATA,
  SET_OVERVIEW_KPI_FUNNEL_LOADING,
  SET_OVERVIEW_KPI_BOOKING_LOADING,
  SET_OVERVIEW_KPI_INTERVENTIONS_LOADING,
  SET_OVERVIEW_KPI_FUNNEL_DATA,
  SET_OVERVIEW_KPI_BOOKING_DATA,
  SET_OVERVIEW_KPI_INTERVENTIONS_DATA,
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

export const setOverviewKpiFunnelLoading = (payload) => ({
  type: SET_OVERVIEW_KPI_FUNNEL_LOADING,
  payload,
});

export const setOverviewKpiBookingLoading = (payload) => ({
  type: SET_OVERVIEW_KPI_BOOKING_LOADING,
  payload,
});

export const setOverviewKpiInterventionsLoading = (payload) => ({
  type: SET_OVERVIEW_KPI_INTERVENTIONS_LOADING,
  payload,
});

export const setOverviewKpiFunnelData = (payload) => ({
  type: SET_OVERVIEW_KPI_FUNNEL_DATA,
  payload,
});

export const setOverviewKpiBookingData = (payload) => ({
  type: SET_OVERVIEW_KPI_BOOKING_DATA,
  payload,
});

export const setOverviewKpiInterventionsData = (payload) => ({
  type: SET_OVERVIEW_KPI_INTERVENTIONS_DATA,
  payload,
});
