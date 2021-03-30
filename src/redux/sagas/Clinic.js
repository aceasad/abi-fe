import { CREATE_CLINIC, UPDATE_CLINIC, GET_CLINIC } from '../constants/Clinic';
import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import clinicService from '../../services/ClinicService';
import {
  createClinicSuccess,
  createClinicError,
  setClinic,
  setIsLoading,
} from '../actions/Clinic';
import { setClinicError } from 'redux/actions/Error';

export function* createClinicSaga() {
  yield takeEvery(CREATE_CLINIC, function* ({ payload }) {
    try {
      const { data } = yield call(clinicService.createClinic, payload);
      yield put(setClinic(data));
      yield put(createClinicSuccess());
    } catch (exception) {
      yield put(createClinicError(exception));
    }
  });
}

export function* updateClinicSaga() {
  yield takeEvery(UPDATE_CLINIC, function* ({ payload }) {
    try {
      yield put(setIsLoading(true));
      yield put(setClinicError(false));
      const { data } = yield call(
        clinicService.updateClinic,
        payload.updatedClinic,
        payload.clinicId
      );
      yield put(setClinic(data));
      yield payload.showSuccess();
    } catch (e) {
      yield put(setClinicError(true));
      yield payload.showError();
    } finally {
      yield put(setIsLoading(false));
    }
  });
}

export function* getClinicSaga() {
  yield takeEvery(GET_CLINIC, function* () {
    try {
      yield put(setIsLoading(true));
      const { data } = yield call(clinicService.getClinic);
      yield put(setClinic(data));
    } catch (e) {
      // TO-DO -> hendlaj posebno errore, ovo je bzvz
      yield put(setClinicError(true));
    } finally {
      yield put(setIsLoading(false));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(createClinicSaga),
    fork(updateClinicSaga),
    fork(getClinicSaga),
  ]);
}
