import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import patientService from '../../services/PatientService';
import {
  GET_PATIENTS,
  SET_PATIENT_ORDER,
  SET_PATIENT_PAGE,
  SET_PATIENT_SEARCH,
  DELETE_PATIENT,
} from 'redux/constants/Patient';
import {
  setPatientLoading,
  setPatientPage,
  setPatients,
} from 'redux/actions/Patient';
import {
  makeSelectPatientRequestData,
  makeSelectLastOnThePage,
} from '../selectors/Patient';

function* getPatients() {
  try {
    const requestData = yield select(makeSelectPatientRequestData());
    yield put(setPatientLoading(true));
    const { data } = yield call(patientService.getPatients, requestData);
    yield put(setPatients(data));
  } catch (err) {
  } finally {
    yield put(setPatientLoading(false));
  }
}

function* deletePatient({ payload }) {
  try {
    const { isLast, page } = yield select(makeSelectLastOnThePage());
    yield put(setPatientLoading(true));
    yield call(patientService.deletePatient, payload.data);
    yield payload.afterDelete();
    if (isLast) yield put(setPatientPage(page - 1));
    else yield getPatients();
  } catch (err) {
  } finally {
    yield put(setPatientLoading(false));
  }
}

export function* patientSaga() {
  yield takeEvery(GET_PATIENTS, getPatients);
  yield takeEvery(SET_PATIENT_PAGE, getPatients);
  yield takeEvery(SET_PATIENT_ORDER, getPatients);
  yield takeEvery(SET_PATIENT_SEARCH, getPatients);
  yield takeEvery(DELETE_PATIENT, deletePatient);
}

export default function* rootSaga() {
  yield all([fork(patientSaga)]);
}
