import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import appointmentService from 'services/AppointmentService';
import staffService from 'services/StaffService';
import patientService from 'services/PatientService';
import moment from 'moment';

import {
  DELETE_APPOINTEMNT,
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
} from 'redux/constants/Appointment';
import {
  appendToAllDoctors,
  appendToAppointmentStatus,
  appendToAppointmentTypes,
  getSignleAppointmnet,
  filterDeletedAppointment,
  setAppointmentsLoading,
  setAppointmentStatusLoading,
  setAppointmentTypesLoading,
  setDateAppointments,
  setDoctorAppointments,
  setDoctorsLoading,
  setPatientsAutocomplete,
  setEndedAppointment,
  setMissingReasons,
  setSignleAppointmnet,
  setSignleAppointmnetLoading,
  setPatientsLoadingAutocomplete,
  addMorePatientsAutocomplete,
} from 'redux/actions/Appointment';

import {
  getScheduledAppointments,
  getAppointmentHistory,
} from 'redux/sagas/Patient';
import { makeSelectCurrentUser } from 'redux/selectors/Auth';
import {
  APPOINTMNET_HISTORY,
  SCHEDULED_APPOINTMENT,
} from 'constants/ClinicConstants';
import {
  makeSelectLastAppointmentHistoryOnThePage,
  makeSelectLastScheduledAppointmentOnThePage,
} from 'redux/selectors/Patient';
import {
  setAppointmentHistoryPage,
  setScheduledPage,
} from 'redux/actions/Patient';
import { makeSelectClinicPatients } from 'redux/selectors/Appointment';

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

export function* getSingleAppointment({ payload }) {
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

export function* deleteAppointemnt({ payload }) {
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
    else
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

export function* getMissingReasons() {
  try {
    const { data } = yield call(appointmentService.getMissingReasons);
    yield put(setMissingReasons(data));
  } catch {}
}

export function* endAppointemnt({ payload }) {
  try {
    yield put(setSignleAppointmnetLoading(true));
    yield call(appointmentService.endAppointemnt, payload);
    yield payload.afterEnd();
    yield put(setEndedAppointment(payload));
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
  yield takeEvery(GET_SINGLE_APPOINTMENT, getSingleAppointment);
  yield takeEvery(DELETE_APPOINTEMNT, deleteAppointemnt);
  yield takeEvery(GET_MISSING_REASONS, getMissingReasons);
  yield takeEvery(END_APPOINTMENT, endAppointemnt);
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
      yield put(getSignleAppointmnet(payload.id));
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
  ]);
}
