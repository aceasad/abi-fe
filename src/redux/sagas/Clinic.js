import { UPDATE_CLINIC } from '../constants/Clinic';
import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import clinicService from '../../services/ClinicService';
import { updateClinicSuccess, updateClinicError } from '../actions/Clinic';
import { push, go } from 'connected-react-router';
import { ROUTES } from 'routes';

export function* updateClinicSaga() {
  yield takeEvery(UPDATE_CLINIC, function* ({ values }) {
    try {
      const { response } = yield call(clinicService.updateClinic, values);
      yield put(updateClinicSuccess(response));
      yield put(push(ROUTES.DASHBORAD));
      yield put(go());
    } catch (exception) {
      put(updateClinicError(exception));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(updateClinicSaga)]);
}
