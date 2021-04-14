import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import appointmentService from '../../services/AppointmentService';

import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  GET_SINGLE_APPOINTMENT,
  CREATE_APPOINTMENT,
  GET_AVAILABLE_TIMESLOTS,
  UPDATE_APPOINTMENT,
} from 'redux/constants/Appointment';
import {
  setAppointmentsLoading,
  setDateAppointments,
  setDoctorAppointments,
  setSignleAppointmnet,
  setSignleAppointmnetLoading,
} from 'redux/actions/Appointments';

import { setIsLoading } from '../actions/Clinic';

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

export function* dateAppointments() {
  yield takeEvery(GET_DATE_APPOINTMENTS, getDateAppointments);
}

export function* doctorAppointments() {
  yield takeEvery(GET_DOCTOR_APPOINTMENTS, getDoctorAppoitnments);
  yield takeEvery(GET_SINGLE_APPOINTMENT, getSingleAppointment);
}

export function* createAppointmentSaga() {
  yield takeEvery(CREATE_APPOINTMENT, function* ({ payload }) {
    try {
      const { data } = yield call(
        appointmentService.createAppointment,
        payload
      );
    } catch (exception) {
      console.log(exception);
    }
  });
}

export function* updateAppointmentSaga() {
  yield takeEvery(UPDATE_APPOINTMENT, function* ({ payload }) {
    try {
      yield put(setIsLoading(true));
      const { data } = yield call(
        appointmentService.updateAppointment(payload)
      );
    } catch (e) {
      console.log(e);
    } finally {
      // TO-DO -> DRUGI isLoading!!!
      yield put(setIsLoading(false));
    }
  });
}

export function* getAvailableTimeslotsSaga() {
  yield takeEvery(GET_AVAILABLE_TIMESLOTS, function* () {
    try {
      yield put(setIsLoading(true));
      const { data } = yield call(appointmentService.getAvailabileTimeslots);
    } catch (e) {
      console.log(e);
    } finally {
      // TO-DO -> DRUGI isLoading!!!
      yield put(setIsLoading(false));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(doctorAppointments),
    fork(dateAppointments),
    fork(createAppointmentSaga),
    fork(updateAppointmentSaga),
    fork(getAvailableTimeslotsSaga),
  ]);
}
