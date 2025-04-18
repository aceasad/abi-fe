import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { setOverviewData, setOverviewLoading, setOverviewClinicStatsData, setOverviewClinicStatsLoading } from 'redux/actions/Overview';
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

export function* getOverviewClinicStatsData({ payload }) {
  try {
    yield put(setOverviewClinicStatsLoading(true));
    const { data } = yield call(
      overviewService.getClinicStatsData,
      payload.start_time,
      payload.end_time
    );
    yield put(setOverviewClinicStatsData(data));
  } catch (err) {
  } finally {
    yield put(setOverviewClinicStatsLoading(false));
  }
}

export function* overviewSaga() {
  yield takeEvery(GET_OVERVIEW_SUMMARY_DATA, getOverviewData);
  yield takeEvery(GET_OVERVIEW_CLINICSTATS_DATA, getOverviewClinicStatsData);
}

export default function* rootSaga() {
  yield all([fork(overviewSaga)]);
}
