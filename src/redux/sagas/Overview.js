import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { setOverviewData, setOverviewLoading } from 'redux/actions/Overview';
import { GET_OVERVIEW_SUMMARY_DATA } from 'redux/constants/Overview';
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

export function* overviewSaga() {
  yield takeEvery(GET_OVERVIEW_SUMMARY_DATA, getOverviewData);
}

export default function* rootSaga() {
  yield all([fork(overviewSaga)]);
}
