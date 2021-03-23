import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { GET_STAFF } from '../constants/Staff';
import { setStaff } from '../actions/Staff';

import StaffService from 'services/StaffService';
import messages from 'views/auth-views/components/LoginForm/messages';

export function* getStaff() {
  yield takeEvery(GET_STAFF, function* () {
    try {
      const { data } = yield call(StaffService.getStaff);
      yield put(setStaff(data.results));
    } catch (error) {}
  });
}

export default function* rootSaga() {
  yield all([fork(getStaff)]);
}
