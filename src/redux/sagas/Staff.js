import { all, takeEvery, put, fork, call, select } from 'redux-saga/effects';
import {
  GET_STAFF,
  SET_STAFF_PAGE,
  GET_STAFF_DETAILS,
  CREATE_STAFF,
  UPDATE_STAFF,
  GET_STAFF_SINGLE,
  DELETE_STAFF,
  GET_STAFF_APPOINTMENTS,
  SET_APPOINTMENTS_PAGE,
  SET_APPOINTMENTS_ORDER,
  GET_APPOINTMENTS_REMINDERS,
  SET_APPOINTMENTS_REMINDERS_PAGE,
  SET_APPOINTMENTS_REMINDERS_ORDER,
  CANCEL_APPOINTMENT_REMINDER,
  REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
  RESCHEDULE_APPOINTMENT_REMINDER,
  GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_ORDER,
} from '../constants/Staff';
import {
  setStaff,
  setStaffLoading,
  setStaffDetails,
  setSingleStaff,
  setAppointmentsLoading,
  setAppointments,
  setAppointmentsRemindersLoading,
  setAppointmentsReminders,
  setMessagesRequiringImmediateAttentionLoading,
  setMessagesRequiringImmediateAttention,
} from '../actions/Staff';

import StaffService from 'services/StaffService';
import {
  makeSelectPagination,
  makeSelectStaffAppointmentsRequestData,
  makeSelectAppointmentsRemindersRequestData,
  makeSelectMessagesRequiringImmediateAttentionRequestData,
} from 'redux/selectors/Staff';
import staffService from 'services/StaffService';
import { UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS } from 'redux/constants/Appointment';

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
  } catch (error) { }
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
  } catch (error) { }
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

export function* getAppointmentsReminders({ payload }) {
  try {
    const requestData = yield select(
      makeSelectAppointmentsRemindersRequestData(payload.field)
    );
    yield put(
      setAppointmentsRemindersLoading({ loading: true, field: payload.field })
    );
    const { data } = yield call(
      staffService.getAppointmentsReminders,
      payload.id,
      requestData,
      { reminderType: payload.reminderType },
      payload.field
    );
    yield put(setAppointmentsReminders({ ...data, field: payload.field }));
  } catch (err) {
  } finally {
    yield put(
      setAppointmentsRemindersLoading({ loading: false, field: payload.field })
    );
  }
}

export function* cancelAppointmentReminder({ payload }) {
  try {
    yield call(
      staffService.cancelAppointmentReminder,
      payload.cancelReminderId
    );
    yield call(getAppointmentsReminders, { payload });
  } catch (err) { }
}

export function* reverseAppointmentReminderCancellation({ payload }) {
  try {
    yield call(
      staffService.reverseAppointmentReminderCancellation,
      payload.reverseReminderCancellationId
    );
    yield call(getAppointmentsReminders, { payload });
  } catch (err) { }
}

export function* rescheduleAppointmentReminder({ payload }) {
  try {
    console.error(payload);
    yield call(
      staffService.rescheduleAppointmentReminder,
      payload.rescheduleReminderData
    );
    yield call(getAppointmentsReminders, { payload });
  } catch (err) { }
}

export function* getMessagesRequiringImmediateAttention({ payload }) {
  try {
    const requestData = yield select(
      makeSelectMessagesRequiringImmediateAttentionRequestData(payload.field)
    );
    yield put(
      setMessagesRequiringImmediateAttentionLoading({
        loading: true,
        field: payload.field,
      })
    );
    const { data } = yield call(
      staffService.getMessagesRequiringImmediateAttention,
      payload.id,
      requestData,
      payload.field
    );
    yield put(
      setMessagesRequiringImmediateAttention({ ...data, field: payload.field })
    );
  } catch (err) {
  } finally {
    yield put(
      setMessagesRequiringImmediateAttentionLoading({
        loading: false,
        field: payload.field,
      })
    );
  }
}

export function* updateMessageRequiringImmediateAttentionStatus({ payload }) {
  try {
    yield call(staffService.updateMessageRequiringImmediateAttention, payload);
    yield call(getMessagesRequiringImmediateAttention, { payload });
  } catch (err) { }
}

export function* getStaff() {
  yield takeEvery(GET_STAFF, getPaginatedStaff);
  yield takeEvery(SET_STAFF_PAGE, getPaginatedStaff);
  yield takeEvery(GET_STAFF_DETAILS, staffDetailsGet);
  yield takeEvery(CREATE_STAFF, createStaff);
  yield takeEvery(UPDATE_STAFF, updateStaff);
  yield takeEvery(GET_STAFF_SINGLE, getSingleStaff);
  yield takeEvery(DELETE_STAFF, deleteStaff);
  yield takeEvery(GET_STAFF_APPOINTMENTS, getStaffAppointments);
  yield takeEvery(SET_APPOINTMENTS_PAGE, getStaffAppointments);
  yield takeEvery(SET_APPOINTMENTS_ORDER, getStaffAppointments);
  yield takeEvery(GET_APPOINTMENTS_REMINDERS, getAppointmentsReminders);
  yield takeEvery(SET_APPOINTMENTS_REMINDERS_PAGE, getAppointmentsReminders);
  yield takeEvery(SET_APPOINTMENTS_REMINDERS_ORDER, getAppointmentsReminders);
  yield takeEvery(CANCEL_APPOINTMENT_REMINDER, cancelAppointmentReminder);
  yield takeEvery(
    REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
    reverseAppointmentReminderCancellation
  );
  yield takeEvery(
    RESCHEDULE_APPOINTMENT_REMINDER,
    rescheduleAppointmentReminder
  );
  yield takeEvery(
    GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
    getMessagesRequiringImmediateAttention
  );
  yield takeEvery(
    SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE,
    getMessagesRequiringImmediateAttention
  );
  yield takeEvery(
    SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_ORDER,
    getMessagesRequiringImmediateAttention
  );
  yield takeEvery(
    UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS,
    updateMessageRequiringImmediateAttentionStatus
  );
}

export default function* rootSaga() {
  yield all([fork(getStaff)]);
}
