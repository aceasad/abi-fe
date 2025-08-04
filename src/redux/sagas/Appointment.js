import { takeEvery, takeLatest, put, call, all, fork, select } from 'redux-saga/effects';
import appointmentService from 'services/AppointmentService';
import staffService from 'services/StaffService';
import patientService from 'services/PatientService';
import moment from 'moment';

import {
  END_APPOINTMENT,
  CANCEL_APPOINTMENT,
  UPDATE_APPOINTMENT_COMMUNICATION_STATUS,
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  GET_SINGLE_APPOINTMENT,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_DOCTORS,
  GET_APPOINTMENT_TYPES,
  GET_APPOINTMENT_STATUSES,
  GET_APPOINTMENT_COMMUNICATION_STATUSES,
  GET_APPOINTMENT_MISSING_REASONS,
  GET_APPOINTMENT_CANCELLATION_REASONS,
  GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
  SAVE_APPOINTMENT_STATUS,
  SEARCH_PATIENTS,
  GET_MORE_SEARCH_RESULTS,
  DELETE_APPOINTMENT_FROM_PATIENTS,
  DELETE_APPOINTMENT_FROM_STAFF,
  DELETE_APPOINTMENT,
  GET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
} from 'redux/constants/Appointment';
import {
  appendToAllDoctors,
  setAppointmentTypesLoading,
  setAppointmentTypes,
  setAppointmentStatuses,
  setAppointmentStatusesLoading,
  setAppointmentCommunicationStatusesLoading,
  setAppointmentCommunicationStatuses,
  setAppointmentMissingReasonsLoading,
  setAppointmentMissingReasons,
  setAppointmentCancellationReasonsLoading,
  setAppointmentCancellationReasons,
  setMessageRequiringImmediateAttentionStatusesLoading,
  setMessageRequiringImmediateAttentionStatuses,
  setMessageRequiringImmediateAttentionStatusesFetched,
  getSingleAppointment,
  filterDeletedAppointment,
  setAppointmentsLoading,
  saveAppointmentStatusLoading,
  setDateAppointments,
  setDoctorAppointments,
  setDoctorsLoading,
  setPatientsAutocomplete,
  setSingleAppointment,
  setSingleAppointmentLoading,
  setPatientsLoadingAutocomplete,
  addMorePatientsAutocomplete,
  setSinglePreAppointmentQuestionnaire,
  setSinglePreAppointmentQuestionnaireLoading,
} from 'redux/actions/Appointment';
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import {
  getScheduledAppointments,
  getAppointmentHistory,
} from 'redux/sagas/Patient';
import { makeSelectCurrentUser } from 'redux/selectors/Auth';
import { getStaffAppointments } from 'redux/sagas/Staff';
import {
  APPOINTMENT_HISTORY,
  SCHEDULED_APPOINTMENT,
} from 'constants/ClinicConstants';
import {
  makeSelectLastAppointmentHistoryOnThePage,
  makeSelectLastScheduledAppointmentOnThePage,
} from 'redux/selectors/Patient';
import {
  makeSelectLastScheduledAppointmentOnTheStaffPage,
  makeSelectLastPastAppointmentOnTheStaffPage,
} from 'redux/selectors/Staff';
import {
  setAppointmentHistoryPage,
  setScheduledPage,
} from 'redux/actions/Patient';
import { makeSelectClinicPatients } from 'redux/selectors/Appointment';
import { setAppointmentsPage } from 'redux/actions/Staff';

export function* getDoctorAppointments({ payload }) {
  try {
    yield put(setAppointmentsLoading(true));
    const { data } = yield call(
      appointmentService.getDoctorAppointments,
      payload
    );
    yield put(setDoctorAppointments(data));
  } catch {
  } finally {
    yield put(setAppointmentsLoading(false));
  }
}
export function* getDateAppointments({ payload }) {
  try {
    const { data } = yield call(
      appointmentService.getDateAppointments,
      payload
    );
    yield put(setDateAppointments(data));
  } catch { }
}

export function* getSingleAppointmentWrapper({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    const { data } = yield call(
      appointmentService.getSingleAppointment,
      payload
    );
    yield put(setSingleAppointment(data));
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* getSinglePreAppointmentQuestionnaireWrapper({ payload }) {
  try {
    yield put(setSinglePreAppointmentQuestionnaireLoading(true));
    const { data } = yield call(
      appointmentService.getSinglePreAppointmentQuestionnaire,
      payload
    );
    yield put(setSinglePreAppointmentQuestionnaire(data));
  } catch {
  } finally {
    yield put(setSinglePreAppointmentQuestionnaireLoading(false));
  }
}

export function* deleteAppointmentFromCalendarView({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    yield call(appointmentService.deleteAppointment, payload.data.id);
    yield payload.afterDelete();
    yield put(
      filterDeletedAppointment({
        date: moment(payload.data.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        id: payload.data.id,
      })
    );
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* deleteAppointmentFromPatients({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    yield call(appointmentService.deleteAppointment, payload.data.id);
    yield payload.afterDelete();
    if (payload.patientAppointment)
      // eslint-disable-next-line default-case
      switch (payload.patientAppointment) {
        case SCHEDULED_APPOINTMENT: {
          const { isLast, page } = yield select(
            makeSelectLastScheduledAppointmentOnThePage()
          );
          if (isLast)
            yield put(
              setScheduledPage({
                page: page - 1,
                id: payload?.data?.patient?.id,
              })
            );
          else
            yield getScheduledAppointments({
              payload: { id: payload?.data?.patient?.id },
            });
          break;
        }
        case APPOINTMENT_HISTORY: {
          const { isLast, page } = yield select(
            makeSelectLastAppointmentHistoryOnThePage()
          );
          if (isLast)
            yield put(
              setAppointmentHistoryPage({
                page: page - 1,
                id: payload?.data?.patient?.id,
              })
            );
          else
            yield getAppointmentHistory({
              payload: { id: payload?.data?.patient?.id },
            });
          break;
        }
      }
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* deleteAppointmentFromStaff({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    yield call(appointmentService.deleteAppointment, payload.data.id);
    yield payload.afterDelete();
    if (payload.temporalType) {
      // eslint-disable-next-line default-case
      switch (payload.temporalType) {
        case SCHEDULED: {
          const { isLast, page } = yield select(
            makeSelectLastScheduledAppointmentOnTheStaffPage()
          );
          if (isLast)
            yield put(
              setAppointmentsPage({
                page: page - 1,
                field: payload.temporalType,
                id: payload?.data?.doctor?.id,
              })
            );
          else
            yield getStaffAppointments({
              payload: {
                id: payload?.data?.doctor?.id,
                field: payload.temporalType,
              },
            });
          break;
        }
        case HISTORY: {
          const { isLast, page } = yield select(
            makeSelectLastPastAppointmentOnTheStaffPage()
          );
          if (isLast)
            yield put(
              setAppointmentsPage({
                page: page - 1,
                field: payload.temporalType,
                id: payload?.data?.doctor?.id,
              })
            );
          else {
            yield getStaffAppointments({
              payload: {
                id: payload?.data?.doctor?.id,
                field: payload.temporalType,
              },
            });
          }
          break;
        }
      }
    }
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* endAppointment({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    const { data } = yield call(appointmentService.endAppointment, payload);
    yield payload.afterEnd();
    yield put(setSingleAppointment(data));
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* cancelAppointment({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    const { data } = yield call(appointmentService.cancelAppointment, payload);
    yield payload.afterCancel();
    yield put(setSingleAppointment(data));
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* updateAppointmentCommunicationStatus({ payload }) {
  try {
    yield put(setSingleAppointmentLoading(true));
    const { data } = yield call(
      appointmentService.updateAppointmentCommunicationStatus,
      payload
    );
    yield payload.afterCommunicationStatusUpdate();
    yield put(setSingleAppointment(data));
  } catch {
  } finally {
    yield put(setSingleAppointmentLoading(false));
  }
}

export function* getClinicDoctors() {
  yield takeEvery(GET_DOCTORS, function* () {
    try {
      yield put(setDoctorsLoading(true));
      const { data } = yield call(staffService.getStaff);
      yield put(appendToAllDoctors(data));
    } catch {
    } finally {
      yield put(setDoctorsLoading(false));
    }
  });
}

export function* getAppointmentTypesSaga() {
  yield takeEvery(GET_APPOINTMENT_TYPES, function* () {
    try {
      yield put(setAppointmentTypesLoading(true));
      const { data } = yield call(appointmentService.getAppointmentTypes);
      yield put(setAppointmentTypes(data));
    } catch {
    } finally {
      yield put(setAppointmentTypesLoading(false));
    }
  });
}

export function* getAppointmentStatusesSaga() {
  yield takeEvery(GET_APPOINTMENT_STATUSES, function* () {
    try {
      yield put(setAppointmentStatusesLoading(true));
      const { data } = yield call(appointmentService.getAppointmentStatuses);
      yield put(setAppointmentStatuses(data));
    } catch {
    } finally {
      yield put(setAppointmentStatusesLoading(false));
    }
  });
}

export function* getAppointmentCommunicationStatusesSaga() {
  yield takeEvery(GET_APPOINTMENT_COMMUNICATION_STATUSES, function* () {
    try {
      yield put(setAppointmentCommunicationStatusesLoading(true));
      const { data } = yield call(
        appointmentService.getAppointmentCommunicationStatuses
      );
      yield put(setAppointmentCommunicationStatuses(data));
    } catch {
    } finally {
      yield put(setAppointmentCommunicationStatusesLoading(false));
    }
  });
}

export function* getAppointmentMissingReasonsSaga() {
  yield takeEvery(GET_APPOINTMENT_MISSING_REASONS, function* () {
    try {
      yield put(setAppointmentMissingReasonsLoading(true));
      const { data } = yield call(
        appointmentService.getAppointmentMissingReasons
      );
      yield put(setAppointmentMissingReasons(data));
    } catch {
    } finally {
      yield put(setAppointmentMissingReasonsLoading(false));
    }
  });
}

export function* getAppointmentCancellationReasonsSaga() {
  yield takeEvery(GET_APPOINTMENT_CANCELLATION_REASONS, function* () {
    try {
      yield put(setAppointmentCancellationReasonsLoading(true));
      const { data } = yield call(
        appointmentService.getAppointmentCancellationReasons
      );
      yield put(setAppointmentCancellationReasons(data));
    } catch {
    } finally {
      yield put(setAppointmentCancellationReasonsLoading(false));
    }
  });
}

export function* getMessageRequiringImmediateAttentionStatusesSaga() {
  yield takeLatest(
    GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
    function* () {
      // Get current state to check if data has already been fetched
      const state = yield select();
      const hasBeenFetched = state.appointment.messageRequiringImmediateAttentionStatusesFetched;

      // If data has already been fetched, skip the API call
      if (hasBeenFetched) {
        console.log('Message requiring immediate attention statuses already fetched, skipping API call');
        return;
      }



      try {
        yield put(setMessageRequiringImmediateAttentionStatusesLoading(true));
        const { data } = yield call(
          appointmentService.getMessageRequiringImmediateAttentionStatuses
        );
        yield put(setMessageRequiringImmediateAttentionStatuses(data));
        yield put(setMessageRequiringImmediateAttentionStatusesFetched(true));
      } catch {
      } finally {
        yield put(setMessageRequiringImmediateAttentionStatusesLoading(false));
      }
    }
  );
}

export function* dateAppointments() {
  yield takeEvery(GET_DATE_APPOINTMENTS, getDateAppointments);
}

export function* doctorAppointments() {
  yield takeEvery(GET_DOCTOR_APPOINTMENTS, getDoctorAppointments);
  yield takeEvery(GET_SINGLE_APPOINTMENT, getSingleAppointmentWrapper);
  yield takeEvery(
    GET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
    getSinglePreAppointmentQuestionnaireWrapper
  );
  yield takeEvery(
    DELETE_APPOINTMENT_FROM_PATIENTS,
    deleteAppointmentFromPatients
  );
  yield takeEvery(DELETE_APPOINTMENT_FROM_STAFF, deleteAppointmentFromStaff);
  yield takeEvery(DELETE_APPOINTMENT, deleteAppointmentFromCalendarView);
  yield takeEvery(
    GET_APPOINTMENT_MISSING_REASONS,
    getAppointmentMissingReasonsSaga
  );
  yield takeEvery(
    GET_APPOINTMENT_CANCELLATION_REASONS,
    getAppointmentCancellationReasonsSaga
  );
  yield takeEvery(
    GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
    getMessageRequiringImmediateAttentionStatusesSaga
  );
  yield takeEvery(CANCEL_APPOINTMENT, cancelAppointment);
  yield takeEvery(
    UPDATE_APPOINTMENT_COMMUNICATION_STATUS,
    updateAppointmentCommunicationStatus
  );
  yield takeEvery(END_APPOINTMENT, endAppointment);
}

export function* createAppointmentSaga() {
  yield takeEvery(CREATE_APPOINTMENT, function* ({ payload }) {
    try {
      yield put(setSingleAppointmentLoading(true));
      const { data } = yield call(
        appointmentService.createAppointment,
        payload
      );
      yield payload.afterCreate(data.start_datetime);
    } catch (error) {
      yield payload.afterError(error?.response?.data[0]);
      yield payload.setFieldValue('time', '');
    } finally {
      yield put(setSingleAppointmentLoading(false));
    }
  });
}

export function* updateAppointmentSaga() {
  yield takeEvery(UPDATE_APPOINTMENT, function* ({ payload }) {
    try {
      yield put(setSingleAppointmentLoading(true));
      yield call(appointmentService.updateAppointment, payload);
      yield payload.afterUpdate();
      yield put(getSingleAppointment(payload.id));
    } catch (error) {
      yield payload.afterError(error?.response?.data[0]);
    } finally {
      yield put(setSingleAppointmentLoading(false));
    }
  });
}

export function* saveAppointmentStatusSaga(payload) {
  yield takeEvery(SAVE_APPOINTMENT_STATUS, function* () {
    try {
      yield put(saveAppointmentStatusLoading(true));
      yield call(appointmentService.saveAppointmentStatus, payload);
    } catch {
    } finally {
      yield put(saveAppointmentStatusLoading(true));
    }
  });
}

export function* searchPatients() {
  yield takeEvery(SEARCH_PATIENTS, function* ({ payload }) {
    try {
      const { organization } = yield select(makeSelectCurrentUser());
      const { next } = yield select(makeSelectClinicPatients());
      yield put(setPatientsLoadingAutocomplete(true));
      const { data } = yield call(
        patientService.searchPatients,
        payload.query,
        organization,
        next
      );
      yield put(setPatientsAutocomplete(data));
    } catch {
    } finally {
      yield put(setPatientsLoadingAutocomplete(false));
    }
  });
}

export function* getMoreSearchResults() {
  yield takeEvery(GET_MORE_SEARCH_RESULTS, function* () {
    try {
      const { next } = yield select(makeSelectClinicPatients());
      yield put(setPatientsLoadingAutocomplete(true));
      if (next) {
        const { data } = yield call(patientService.getMoreSearchResults(next));
        yield put(addMorePatientsAutocomplete(data));
      }
    } catch {
    } finally {
      yield put(setPatientsLoadingAutocomplete(false));
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(doctorAppointments),
    fork(dateAppointments),
    fork(createAppointmentSaga),
    fork(updateAppointmentSaga),
    fork(getClinicDoctors),
    fork(getAppointmentTypesSaga),
    fork(getAppointmentStatusesSaga),
    fork(getAppointmentCommunicationStatusesSaga),
    fork(getAppointmentMissingReasonsSaga),
    fork(getAppointmentCancellationReasonsSaga),
    fork(saveAppointmentStatusSaga),
    fork(searchPatients),
    fork(getMoreSearchResults),
  ]);
}
