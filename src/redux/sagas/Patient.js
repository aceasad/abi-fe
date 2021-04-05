import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import patientService from '../../services/PatientService';
import {
  GET_PATIENTS,
  SET_PATIENT_ORDER,
  SET_PATIENT_PAGE,
  SET_PATIENT_SEARCH,
  DELETE_PATIENT,
  GET_PATIENTS_DETAILS,
  CREATE_PATIENT,
  GET_PATIENT_SINGLE,
  UPDATE_PATIENT,
} from 'redux/constants/Patient';
import {
  setPatientDetails,
  setPatientLoading,
  setPatientPage,
  setPatients,
  setSinglePatient,
  modifyPatient,
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

function* getPatientDetails() {
  try {
    const { data } = yield call(patientService.getPatientDetails);
    yield put(setPatientDetails(data));
  } catch (err) {}
}

function* createPatient({ payload }) {
  try {
    yield put(setPatientLoading(true));
    yield call(patientService.createPatient, payload.data);
    yield payload.afterCreate();
    yield getPatients();
  } catch (err) {
  } finally {
    yield put(setPatientLoading(false));
  }
}

function* getPatientSingle({ payload }) {
  try {
    yield put(setPatientLoading(true));
    const { data } = yield call(patientService.getPatientSingle, payload);
    yield put(setSinglePatient(data));
  } catch (err) {
  } finally {
    yield put(setPatientLoading(false));
  }
}

function* updatePatient({ payload }) {
  try {
    yield put(setPatientLoading(true));
    yield call(patientService.updatePatient, payload.data);
    yield payload.afterUpdate();
    yield put(modifyPatient(payload.data));
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
  yield takeEvery(GET_PATIENTS_DETAILS, getPatientDetails);
  yield takeEvery(CREATE_PATIENT, createPatient);
  yield takeEvery(GET_PATIENT_SINGLE, getPatientSingle);
  yield takeEvery(UPDATE_PATIENT, updatePatient);
}

export default function* rootSaga() {
  yield all([fork(patientSaga)]);
}
