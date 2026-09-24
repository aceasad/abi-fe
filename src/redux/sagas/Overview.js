import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  setOverviewData,
  setOverviewLoading,
  setOverviewKpiFunnelData,
  setOverviewKpiFunnelLoading,
  setOverviewKpiBookingData,
  setOverviewKpiBookingLoading,
  setOverviewKpiInterventionsData,
  setOverviewKpiInterventionsLoading,
} from 'redux/actions/Overview';
import { GET_OVERVIEW_CLINICSTATS_DATA, GET_OVERVIEW_SUMMARY_DATA } from 'redux/constants/Overview';
import overviewService from 'services/OverviewService';

export function* getOverviewData({ payload }) {
  try {
    yield put(setOverviewLoading(true));
    const { data } = yield call(
      overviewService.getSummaryData,
      payload.interval
    );
    yield put(setOverviewData(data));
  } catch (err) {
  } finally {
    yield put(setOverviewLoading(false));
  }
}

function* fetchKpiFunnel(start_time, end_time, campaign_id) {
  try {
    yield put(setOverviewKpiFunnelLoading(true));
    const { data } = yield call(
      overviewService.getKpiFunnel,
      start_time,
      end_time,
      campaign_id
    );
    yield put(setOverviewKpiFunnelData(data));
  } catch (err) {
  } finally {
    yield put(setOverviewKpiFunnelLoading(false));
  }
}

function* fetchKpiBookingStatuses(start_time, end_time, campaign_id) {
  try {
    yield put(setOverviewKpiBookingLoading(true));
    const { data } = yield call(
      overviewService.getKpiBookingStatuses,
      start_time,
      end_time,
      campaign_id
    );
    yield put(setOverviewKpiBookingData(data));
  } catch (err) {
  } finally {
    yield put(setOverviewKpiBookingLoading(false));
  }
}

function* fetchKpiInterventions(start_time, end_time, campaign_id) {
  try {
    yield put(setOverviewKpiInterventionsLoading(true));
    const { data } = yield call(
      overviewService.getKpiInterventions,
      start_time,
      end_time,
      campaign_id
    );
    yield put(setOverviewKpiInterventionsData(data));
  } catch (err) {
  } finally {
    yield put(setOverviewKpiInterventionsLoading(false));
  }
}

export function* getOverviewClinicStatsData({ payload }) {
  const { start_time, end_time, campaign_id } = payload;
  // Per-card endpoints in parallel so each section can render as soon as it lands.
  yield all([
    call(fetchKpiFunnel, start_time, end_time, campaign_id),
    call(fetchKpiBookingStatuses, start_time, end_time, campaign_id),
    call(fetchKpiInterventions, start_time, end_time, campaign_id),
  ]);
}

export function* overviewSaga() {
  yield takeEvery(GET_OVERVIEW_SUMMARY_DATA, getOverviewData);
  yield takeEvery(GET_OVERVIEW_CLINICSTATS_DATA, getOverviewClinicStatsData);
}

export default function* rootSaga() {
  yield all([fork(overviewSaga)]);
}
