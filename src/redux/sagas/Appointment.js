import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  CREATE_APPOINTMENT,
  GET_AVAILABLE_TIMESLOTS,
  UPDATE_APPOINTMENT,
} from 'redux/constants/Appointment';
import appointmentService from 'services/AppointmentService';
import { setIsLoading } from '../actions/Clinic';

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
      yield put(setIsLoading(false));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(createAppointmentSaga),
    fork(updateAppointmentSaga),
    fork(getAvailableTimeslotsSaga),
  ]);
}
