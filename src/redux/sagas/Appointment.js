import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import appointmentService from '../../services/AppointmentService';

import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
} from 'redux/constants/Appointment';
import {
  setAppointmentsLoading,
  setDateAppointments,
  setDoctorAppointments,
} from 'redux/actions/Appointments';

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

export function* dateAppointments() {
  yield takeEvery(GET_DATE_APPOINTMENTS, getDateAppointments);
}

export function* doctorAppointments() {
  yield takeEvery(GET_DOCTOR_APPOINTMENTS, getDoctorAppoitnments);
}

export default function* rootSaga() {
  yield all([fork(doctorAppointments), fork(dateAppointments)]);
}
