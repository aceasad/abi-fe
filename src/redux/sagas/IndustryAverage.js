import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import industryAverage from '../../services/IndustryAverageService';
import {
  UPDATED_INDUSTRY_AVERAGE,
  GET_INDUSTRY_AVERAGE,
} from '../../redux/constants/IndustryAverage';
import {
  updateIndustryAverageSuccess,
  updateIndustryAverageError,
  getIndustryAverageSuccess,
  getIndustryAverageError,
} from '../../redux/actions/IndustryAverage';

export function* updateIndustryAverageSaga() {
  yield takeEvery(UPDATED_INDUSTRY_AVERAGE, function* ({ values }) {
    try {
      const { response } = yield call(
        industryAverage.updateIndustryAverge,
        values
      );
      yield put(updateIndustryAverageSuccess(response));
    } catch (exception) {
      put(updateIndustryAverageError(exception.message));
    }
  });
}

export function* getIndustryAverage() {
  yield takeEvery(GET_INDUSTRY_AVERAGE, function* () {
    try {
      const { data } = yield call(industryAverage.getIndustryAverage);
      yield put(getIndustryAverageSuccess(data));
    } catch (exception) {
      yield put(getIndustryAverageError(exception.message));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(updateIndustryAverageSaga), fork(getIndustryAverage)]);
}
