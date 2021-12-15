import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import appointmentService from 'services/AppointmentService';
import staffService from 'services/StaffService';
import patientService from 'services/PatientService';
import moment from 'moment';

import {
  END_APPOINTMENT,
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  GET_MISSING_REASONS,
  GET_SINGLE_APPOINTMENT,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_APPOINTMENT_TYPES,
  GET_APPOINTMENT_STATUS,
  GET_DOCTORS,
  SEARCH_PATIENTS,
  GET_MORE_SEARCH_RESULTS,
  DELETE_APPOINTMENT_FROM_PATIENTS,
  DELETE_APPOINTMENT_FROM_STAFF,
  DELETE_APPOINTMENT,
  GET_APPOINTMENTS_REMINDERS_PAGE,
  CANCEL_APPOINTMENT_REMINDER,
  REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
} from 'redux/constants/Appointment';
import {
  appendToAllDoctors,
  appendToAppointmentStatus,
  appendToAppointmentTypes,
  getSingleAppointment,
  filterDeletedAppointment,
  setAppointmentsLoading,
  setAppointmentStatusLoading,
  setAppointmentTypesLoading,
  setDateAppointments,
  setDoctorAppointments,
  setDoctorsLoading,
  setPatientsAutocomplete,
  setMissingReasons,
  setSignleAppointmnet,
  setSignleAppointmnetLoading,
  setPatientsLoadingAutocomplete,
  addMorePatientsAutocomplete,
  setAppointmentsRemindersPage,
  setAppointmentsRemindersPageLoading,
} from 'redux/actions/Appointment';
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import {
  getScheduledAppointments,
  getAppointmentHistory,
} from 'redux/sagas/Patient';
import { makeSelectCurrentUser } from 'redux/selectors/Auth';
import { getStaffAppointments } from 'redux/sagas/Staff';
import {
  APPOINTMNET_HISTORY,
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
import {
  makeSelectClinicPatients,
  makeSelectAppointmentsRemindersLastOnThePage,
} from 'redux/selectors/Appointment';
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
  } catch {}
}

export function* getSingleAppointmentWrapper({ payload }) {
  try {
    yield put(setSignleAppointmnetLoading(true));
    const { data } = yield call(
      appointmentService.getSingleAppointment,
      payload
    );
    yield put(setSignleAppointmnet(data));
  } catch {
  } finally {
    yield put(setSignleAppointmnetLoading(false));
  }
}

export function* deleteAppointmentFromCalendarView({ payload }) {
  try {
    yield put(setSignleAppointmnetLoading(true));
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
    yield put(setSignleAppointmnetLoading(false));
  }
}

export function* deleteAppointmentFromPatients({ payload }) {
  try {
    yield put(setSignleAppointmnetLoading(true));
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
        case APPOINTMNET_HISTORY: {
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
    yield put(setSignleAppointmnetLoading(false));
  }
}

export function* deleteAppointmentFromStaff({ payload }) {
  try {
    yield put(setSignleAppointmnetLoading(true));
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
    yield put(setSignleAppointmnetLoading(false));
  }
}

export function* getMissingReasons() {
  try {
    const { data } = yield call(appointmentService.getMissingReasons);
    yield put(setMissingReasons(data));
  } catch {}
}

export function* endAppointment({ payload }) {
  try {
    yield put(setSignleAppointmnetLoading(true));
    const { data } = yield call(appointmentService.endAppointment, payload);
    yield payload.afterEnd();
    yield put(setSignleAppointmnet(data));
  } catch {
  } finally {
    yield put(setSignleAppointmnetLoading(false));
  }
}

export function* dateAppointments() {
  yield takeEvery(GET_DATE_APPOINTMENTS, getDateAppointments);
}

export function* doctorAppointments() {
  yield takeEvery(GET_DOCTOR_APPOINTMENTS, getDoctorAppointments);
  yield takeEvery(GET_SINGLE_APPOINTMENT, getSingleAppointmentWrapper);
  yield takeEvery(
    DELETE_APPOINTMENT_FROM_PATIENTS,
    deleteAppointmentFromPatients
  );
  yield takeEvery(DELETE_APPOINTMENT_FROM_STAFF, deleteAppointmentFromStaff);
  yield takeEvery(DELETE_APPOINTMENT, deleteAppointmentFromCalendarView);
  yield takeEvery(GET_MISSING_REASONS, getMissingReasons);
  yield takeEvery(END_APPOINTMENT, endAppointment);
}

export function* createAppointmentSaga() {
  yield takeEvery(CREATE_APPOINTMENT, function* ({ payload }) {
    try {
      yield put(setSignleAppointmnetLoading(true));
      const { data } = yield call(
        appointmentService.createAppointment,
        payload
      );
      yield payload.afterCreate(data.start_datetime);
    } catch (error) {
      yield payload.afterError(error?.response?.data[0]);
      yield payload.setFieldValue('time', '');
    } finally {
      yield put(setSignleAppointmnetLoading(false));
    }
  });
}

export function* updateAppointmentSaga() {
  yield takeEvery(UPDATE_APPOINTMENT, function* ({ payload }) {
    try {
      yield put(setSignleAppointmnetLoading(true));
      yield call(appointmentService.updateAppointment, payload);
      yield payload.afterUpdate();
      yield put(getSingleAppointment(payload.id));
    } catch (error) {
      yield payload.afterError(error?.response?.data[0]);
    } finally {
      yield put(setSignleAppointmnetLoading(false));
    }
  });
}

export function* getAppointmentTypesSaga() {
  yield takeEvery(GET_APPOINTMENT_TYPES, function* () {
    try {
      yield put(setAppointmentTypesLoading(true));
      const { data } = yield call(appointmentService.getAppointmentTypes);
      yield put(appendToAppointmentTypes(data));
    } catch {
    } finally {
      yield put(setAppointmentTypesLoading(false));
    }
  });
}

export function* getAppointmentStatusSaga() {
  yield takeEvery(GET_APPOINTMENT_STATUS, function* () {
    try {
      yield put(setAppointmentStatusLoading(true));
      const { data } = yield call(appointmentService.getAppointmentStatus);
      yield put(appendToAppointmentStatus(data));
    } catch {
    } finally {
      yield put(setAppointmentStatusLoading(false));
    }
  });
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

export function* getAppointmentsReminders({ payload }) {
  try {
    yield put(setAppointmentsRemindersPageLoading(true));
    const { data } = yield call(
      appointmentService.getAppointmentsReminders,
      payload.status
    );
    yield put(setAppointmentsRemindersPage(data));
  } catch (err) {
  } finally {
    yield put(setAppointmentsRemindersPageLoading(false));
  }
}

function* cancelAppointmentReminder({ payload }) {
  try {
    const { isLast, page } = yield select(
      makeSelectAppointmentsRemindersLastOnThePage()
    );
    yield put(setAppointmentsRemindersPageLoading(true));
    yield call(appointmentService.cancelAppointmentReminder, payload.data);
    yield payload.afterCancellation();
    if (isLast) yield put(setAppointmentsRemindersPage(page - 1));
    else yield getAppointmentsReminders();
  } catch (err) {
  } finally {
    yield put(setAppointmentsRemindersPageLoading(false));
  }
}

function* reverseAppointmentReminderCancellation({ payload }) {
  try {
    const { isLast, page } = yield select(
      makeSelectAppointmentsRemindersLastOnThePage()
    );
    yield put(setAppointmentsRemindersPageLoading(true));
    yield call(
      appointmentService.reverseAppointmentReminderCancellation,
      payload.data
    );
    yield payload.afterReverseCancellation();
    if (isLast) yield put(setAppointmentsRemindersPage(page - 1));
    else yield getAppointmentsReminders();
  } catch (err) {
  } finally {
    yield put(setAppointmentsRemindersPageLoading(false));
  }
}

export function* appointmentsRemindersSaga() {
  yield takeEvery(GET_APPOINTMENTS_REMINDERS_PAGE, getAppointmentsReminders);
  yield takeEvery(CANCEL_APPOINTMENT_REMINDER, cancelAppointmentReminder);
  yield takeEvery(
    REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
    reverseAppointmentReminderCancellation
  );
}

export default function* rootSaga() {
  yield all([
    fork(doctorAppointments),
    fork(dateAppointments),
    fork(createAppointmentSaga),
    fork(updateAppointmentSaga),
    fork(getAppointmentStatusSaga),
    fork(getAppointmentTypesSaga),
    fork(getClinicDoctors),
    fork(searchPatients),
    fork(getMoreSearchResults),
    fork(appointmentsRemindersSaga),
  ]);
}
