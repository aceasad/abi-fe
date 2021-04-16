import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import appointmentService from '../../services/AppointmentService';
import moment from 'moment';

import {
  DELETE_APPOINTEMNT,
  END_APPOINTMENT,
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  GET_MISSING_REASONS,
  GET_SINGLE_APPOINTMENT,
} from 'redux/constants/Appointment';
import {
  filterDeletedAppointment,
  setAppointmentsLoading,
  setDateAppointments,
  setDoctorAppointments,
  setEndedAppointment,
  setMissingReasons,
  setSignleAppointmnet,
  setSignleAppointmnetLoading,
} from 'redux/actions/Appointment';

export function* getDoctorAppoitnments({ payload }) {
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
  yield takeEvery(GET_DOCTOR_APPOINTMENTS, getDoctorAppoitnments);
  yield takeEvery(GET_SINGLE_APPOINTMENT, getSingleAppointment);
  yield takeEvery(DELETE_APPOINTEMNT, deleteAppointemnt);
  yield takeEvery(GET_MISSING_REASONS, getMissingReasons);
  yield takeEvery(END_APPOINTMENT, endAppointemnt);
}

export default function* rootSaga() {
  yield all([fork(doctorAppointments), fork(dateAppointments)]);
}
