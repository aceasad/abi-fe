import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import industryAverage from '../../services/IndustryAverageService';
import {
  UPDATED_INDUSTRY_AVERAGE,
  GET_INDUSTRY_AVERAGE,
  CREATED_INDUSTRY_AVERAGE,
} from '../../redux/constants/IndustryAverage';
import {
  updateIndustryAverageSuccess,
  setLoading,
  updateIndustryAverageError,
  getIndustryAverageSuccess,
  getIndustryAverageError,
  createIndustryAverageSuccess,
  createIndustryAverageError,
} from '../../redux/actions/IndustryAverage';

export function* updateIndustryAverageSaga() {
  yield takeEvery(UPDATED_INDUSTRY_AVERAGE, function* ({ values }) {
    try {
      yield put(setLoading(true));
      const { response } = yield call(
        industryAverage.updateIndustryAverge,
        values
      );
      yield put(updateIndustryAverageSuccess(response));
    } catch (exception) {
      put(updateIndustryAverageError(exception.message));
    } finally {
      yield put(setLoading(false));
    }
  });
}

export function* createIndustryAverageSaga() {
  yield takeEvery(CREATED_INDUSTRY_AVERAGE, function* ({ values }) {
    try {
      yield put(setLoading(true));
      const { response } = yield call(
        industryAverage.createIndustryAverage,
        values
      );
      yield put(createIndustryAverageSuccess(response));
    } catch (exception) {
      put(createIndustryAverageError(exception.message));
    } finally {
      yield put(setLoading(false));
    }
  });
}

export function* getIndustryAverage() {
  yield takeEvery(GET_INDUSTRY_AVERAGE, function* () {
    try {
      yield put(setLoading(true));
      const { data } = yield call(industryAverage.getIndustryAverage);
      yield put(getIndustryAverageSuccess(data));
    } catch (exception) {
      yield put(getIndustryAverageError(exception.message));
    } finally {
      yield put(setLoading(false));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateIndustryAverageSaga),
    fork(getIndustryAverage),
    fork(createIndustryAverageSaga),
  ]);
}
