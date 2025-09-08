import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import patientService from '../../services/PatientService';
import {
  GET_PATIENTS,
  SET_PATIENT_ORDER,
  SET_PATIENT_PAGE,
  SET_PATIENT_SEARCH,
  DELETE_PATIENT,
  GET_PATIENTS_DETAILS,
  GET_PATIENT_DETAILS_NEW_PATIENT_FORM,
  CREATE_PATIENT,
  GET_PATIENT_SINGLE,
  UPDATE_PATIENT,
  GET_PATIENT_OVERVIEW,
  SET_SCHEDULED_PAGE,
  SET_SCHEDULED_ORDER,
  SET_HISTORY_PAGE,
  CHANGE_PATIENT,
  GET_APPOINTMENT_HISTORY,
  GET_SCHEDULED_APPOINTMENTS,
  MARK_CONVERSATION_HUMAN_NOT_REQUIRED,
  MARK_CONVERSATION_NOT_IN_EMERGENCY_SITUATION,
  GET_CAMPAIGNS,
} from 'redux/constants/Patient';
import {
  setPatientDetails,
  setPatientDetailsNewPatientForm,
  setPatientLoading,
  setPatientPage,
  setPatients,
  setSinglePatient,
  modifyPatient,
  setAppointmentHistoryLoading,
  setScheduledAppointmentsLoading,
  setScheduledAppointments,
  setAppointmentHistory,
  togglePatientWhitelist,
  setCampaigns,
  setCampaignsLoading,
} from 'redux/actions/Patient';
import {
  makeSelectPatientRequestData,
  makeSelectLastOnThePage,
  makeSelectScheduledData,
  makeSelectHistoryPage,
} from '../selectors/Patient';
import { getPreviousOperations } from './Anemnesis';
import { getMedicalConditions } from './Anemnesis';
import messages from 'views/app-views/PatientsPage/messages';
import dayjs from 'utils/dayjs';

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

function* getPatientDetails({ payload }) {
  try {
    const { data } = yield call(patientService.getPatientDetails);
    yield put(setPatientDetails(data));
  } catch (err) { }
}

function* getPatientDetailsNewPatientFormData() {
  try {
    const { data } = yield call(patientService.getPatientDetailsNewPatientForm);
    yield put(setPatientDetailsNewPatientForm(data));
  } catch (error) { }
}

function* createPatient({ payload }) {
  try {
    yield put(setPatientLoading(true));
    yield call(patientService.createPatient, payload.data);
    yield payload.enableRedirect();
    yield payload.afterCreate();
    yield getPatients();
  } catch (err) {
    if (err?.response?.status === 400) {
      var error_data = err?.response?.data
      if (error_data['ExternalIdentificationNumber'] == 'NHS number is incorrect!') {
        yield payload.setErrors({ ExternalIdentificationNumber: messages.nhsNumberIncorrect });
      }
      else if (error_data['phone_number'] == 'patient with this phone number already exists.') {
        yield payload.setErrors({ phone_number: messages.phoneNumberAlreadyExists });
      }
      else {
        yield payload.setErrors({ email: messages.emailAlreadyTaken });
      }
    }
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
    yield call(patientService.updatePatient, payload.id, payload.data);
    yield payload.enableRedirect();
    yield payload.afterUpdate();
    yield put(modifyPatient(payload.data));
  } catch (err) {
    if (err?.response?.status === 400) {
      yield payload.setErrors({ email: messages.emailAlreadyTaken });
    }
  } finally {
    yield put(setPatientLoading(false));
  }
}

export function* getScheduledAppointments({ payload }) {
  try {
    const requestData = yield select(makeSelectScheduledData());
    yield put(setScheduledAppointmentsLoading(true));
    const { data } = yield call(
      patientService.getScheduledAppointments,
      payload.id,
      requestData
    );
    yield put(setScheduledAppointments(data));
  } catch (err) {
  } finally {
    yield put(setScheduledAppointmentsLoading(false));
  }
}

export function* getAppointmentHistory({ payload }) {
  try {
    const page = yield select(makeSelectHistoryPage());
    yield put(setAppointmentHistoryLoading(true));
    const { data } = yield call(
      patientService.getAppointmentHistory,
      payload.id,
      page
    );
    yield put(setAppointmentHistory(data));
  } catch (err) {
  } finally {
    yield put(setAppointmentHistoryLoading(false));
  }
}

function* getPatientOverview({ payload }) {
  try {
    yield all([
      getPatientSingle({ payload: payload.id }),
      getScheduledAppointments({ payload }),
      getAppointmentHistory({ payload }),
    ]);
  } catch (err) { }
}

function* changePatient({ payload }) {
  try {
    yield call(patientService.updatePatientPart, payload.id, payload.data);
    yield put(togglePatientWhitelist());
  } catch (err) { }
}

function* markConversationHumanNotRequired({ payload }) {
  try {
    yield call(patientService.markConversationHumanNotRequired, payload);
  } catch (err) { }
}

function* markConversationNotInEmergencySituation({ payload }) {
  try {
    yield call(patientService.markConversationNotInEmergencySituation, payload);
  } catch (err) { }
}

function* getCampaigns() {
  try {
    yield put(setCampaignsLoading(true));
    const { data } = yield call(patientService.getOrganizationCampaigns);
    // Sort campaigns by created_at in ascending order for proper date range selection
    const sortedCampaigns = data.sort((a, b) =>
      dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
    );
    yield put(setCampaigns(sortedCampaigns));
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
  } finally {
    yield put(setCampaignsLoading(false));
  }
}

export function* patientSaga() {
  yield takeEvery(GET_PATIENTS, getPatients);
  yield takeEvery(SET_PATIENT_PAGE, getPatients);
  yield takeEvery(SET_PATIENT_ORDER, getPatients);
  yield takeEvery(SET_PATIENT_SEARCH, getPatients);
  yield takeEvery(DELETE_PATIENT, deletePatient);
  yield takeEvery(GET_PATIENTS_DETAILS, getPatientDetails);
  yield takeEvery(
    GET_PATIENT_DETAILS_NEW_PATIENT_FORM,
    getPatientDetailsNewPatientFormData
  );
  yield takeEvery(CREATE_PATIENT, createPatient);
  yield takeEvery(GET_PATIENT_SINGLE, function* ({ payload }) {
    yield all([
      getPatientSingle({ payload: payload.id }),
      getPreviousOperations({ payload }),
      getMedicalConditions({ payload }),
    ]);
  });
  yield takeEvery(UPDATE_PATIENT, updatePatient);
  yield takeEvery(GET_PATIENT_OVERVIEW, getPatientOverview);
  yield takeEvery(SET_SCHEDULED_PAGE, getScheduledAppointments);
  yield takeEvery(SET_SCHEDULED_ORDER, getScheduledAppointments);
  yield takeEvery(SET_HISTORY_PAGE, getAppointmentHistory);
  yield takeEvery(CHANGE_PATIENT, changePatient);
  yield takeEvery(GET_APPOINTMENT_HISTORY, getAppointmentHistory);
  yield takeEvery(GET_SCHEDULED_APPOINTMENTS, getScheduledAppointments);
  yield takeEvery(
    MARK_CONVERSATION_HUMAN_NOT_REQUIRED,
    markConversationHumanNotRequired
  );
  yield takeEvery(
    MARK_CONVERSATION_NOT_IN_EMERGENCY_SITUATION,
    markConversationNotInEmergencySituation
  );
  yield takeEvery(GET_CAMPAIGNS, getCampaigns);
}

export default function* rootSaga() {
  yield all([fork(patientSaga)]);
}
