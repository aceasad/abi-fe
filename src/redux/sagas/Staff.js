import { all, takeEvery, put, fork, call, select } from 'redux-saga/effects';
import { GET_STAFF, SET_STAFF_PAGE } from '../constants/Staff';
import { setStaff, setStaffLoading } from '../actions/Staff';

import StaffService from 'services/StaffService';
import { makeSelectPagination } from 'redux/selectors/Staff';

export function* getStaff() {
  yield takeEvery(GET_STAFF, function* () {
    try {
      yield put(setStaffLoading(true));
      const { data } = yield call(StaffService.getStaff);
      yield put(setStaff({ results: data.results, count: data.count }));
    } catch (error) {
    } finally {
      yield put(setStaffLoading(false));
    }
  });
}

export function* getPaginatedStaff() {
  yield takeEvery(SET_STAFF_PAGE, function* () {
    try {
      const pagination = yield select(makeSelectPagination());
      const { data } = yield call(StaffService.getPaginatedStaff, pagination);
      yield put(setStaff({ results: data.results, count: data.count }));
    } catch (error) {
    } finally {
      yield put(setStaffLoading(false));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getStaff), fork(getPaginatedStaff)]);
}
