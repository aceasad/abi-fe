import { all, takeEvery, put, fork, call, select } from 'redux-saga/effects';
import {
  GET_STAFF,
  SET_STAFF_PAGE,
  GET_STAFF_DETAILS,
  CREATE_STAFF,
  UPDATE_STAFF,
  GET_STAFF_SINGLE,
  DELTETE_STAFF,
  GET_STAFF_APPOINTMENTS,
  SET_STAFF_APPOINTMENTS_PAGE,
  SET_STAFF_APPOINTMENTS_ORDER,
} from '../constants/Staff';
import {
  setStaff,
  setStaffLoading,
  setStaffDetails,
  setSingleStaff,
  setAppointmentsLoading,
  setAppointments,
} from '../actions/Staff';

import StaffService from 'services/StaffService';
import {
  makeSelectPagination,
  makeSelectStaffAppointmentsRequestData,
} from 'redux/selectors/Staff';
import staffService from 'services/StaffService';

function* getPaginatedStaff() {
  try {
    yield put(setStaffLoading(true));
    const pagination = yield select(makeSelectPagination());
    const { data } = yield call(StaffService.getPaginatedStaff, pagination);
    yield put(setStaff(data));
  } catch (error) {
  } finally {
    yield put(setStaffLoading(false));
  }
}

function* staffDetailsGet() {
  try {
    const { data } = yield call(StaffService.getStaffDetails);
    yield put(setStaffDetails(data));
  } catch (error) {}
}

function* createStaff({ payload }) {
  try {
    yield put(setStaffLoading(true));
    yield call(StaffService.createStaff, payload.data);
    yield payload.afterCreate();
  } catch (error) {
  } finally {
    yield put(setStaffLoading(false));
  }
}

function* updateStaff({ payload }) {
  try {
    yield put(setStaffLoading(true));
    yield call(StaffService.updateStaff, payload.data);
    yield payload.afterUpdate();
    yield put(setSingleStaff(null));
  } catch (error) {
  } finally {
    yield put(setStaffLoading(false));
  }
}

function* getSingleStaff({ payload }) {
  try {
    yield put(setStaffLoading(true));
    const { data } = yield call(StaffService.getSingleStaff, payload);
    yield put(setSingleStaff(data));
  } catch (error) {
  } finally {
    yield put(setStaffLoading(false));
  }
}

function* deleteStaff({ payload }) {
  try {
    yield call(StaffService.deleteStaff, payload.id);
    yield payload.afterDelete();
    yield getPaginatedStaff();
  } catch (error) {}
}

export function* getStaffAppointments({ payload }) {
  try {
    const requestData = yield select(
      makeSelectStaffAppointmentsRequestData(payload.field)
    );
    yield put(setAppointmentsLoading({ loading: true, field: payload.field }));
    const { data } = yield call(
      staffService.getAppointments,
      payload.id,
      requestData,
      payload.field
    );
    yield put(setAppointments({ ...data, field: payload.field }));
  } catch (err) {
  } finally {
    yield put(setAppointmentsLoading({ loading: false, field: payload.field }));
  }
}

export function* getStaff() {
  yield takeEvery(GET_STAFF, getPaginatedStaff);
  yield takeEvery(SET_STAFF_PAGE, getPaginatedStaff);
  yield takeEvery(GET_STAFF_DETAILS, staffDetailsGet);
  yield takeEvery(CREATE_STAFF, createStaff);
  yield takeEvery(UPDATE_STAFF, updateStaff);
  yield takeEvery(GET_STAFF_SINGLE, getSingleStaff);
  yield takeEvery(DELTETE_STAFF, deleteStaff);
  yield takeEvery(GET_STAFF_APPOINTMENTS, getStaffAppointments);
  yield takeEvery(SET_STAFF_APPOINTMENTS_PAGE, getStaffAppointments);
  yield takeEvery(SET_STAFF_APPOINTMENTS_ORDER, getStaffAppointments);
}

export default function* rootSaga() {
  yield all([fork(getStaff)]);
}
