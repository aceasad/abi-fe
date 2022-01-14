import {
  GET_STAFF,
  GET_STAFF_DETAILS,
  SET_STAFF,
  SET_STAFF_DETAILS,
  SET_STAFF_LOADING,
  SET_STAFF_PAGE,
  CREATE_STAFF,
  UPDATE_STAFF,
  GET_STAFF_SINGLE,
  SET_STAFF_SINGLE,
  DELETE_STAFF,
  GET_STAFF_APPOINTMENTS,
  SET_APPOINTMENTS,
  SET_APPOINTMENTS_PAGE,
  SET_APPOINTMENTS_LOADING,
  SET_APPOINTMENTS_ORDER,
  GET_APPOINTMENTS_REMINDERS,
  SET_APPOINTMENTS_REMINDERS,
  SET_APPOINTMENTS_REMINDERS_PAGE,
  SET_APPOINTMENTS_REMINDERS_LOADING,
  SET_APPOINTMENTS_REMINDERS_ORDER,
  CANCEL_APPOINTMENT_REMINDER,
  REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
  RESCHEDULE_APPOINTMENT_REMINDER,
  GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_LOADING,
  SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_ORDER,
  SET_SCHEDULED_STAFF_APPOINTMENTS_PAGE,
  SET_PAST_STAFF_APPOINTMENTS_PAGE,
} from '../constants/Staff';

// staff
export const getStaff = () => ({
  type: GET_STAFF,
});

export const setStaff = (payload) => ({
  type: SET_STAFF,
  payload,
});

export const setStaffPage = (payload) => ({
  type: SET_STAFF_PAGE,
  payload,
});

export const setStaffLoading = (payload) => ({
  type: SET_STAFF_LOADING,
  payload,
});

export const getStaffDetails = () => ({
  type: GET_STAFF_DETAILS,
});

export const setStaffDetails = (payload) => ({
  type: SET_STAFF_DETAILS,
  payload,
});

export const createStaff = (payload) => ({
  type: CREATE_STAFF,
  payload,
});

export const updateStaff = (payload) => ({
  type: UPDATE_STAFF,
  payload,
});

export const getSingleStaff = (payload) => ({
  type: GET_STAFF_SINGLE,
  payload,
});

export const setSingleStaff = (payload) => ({
  type: SET_STAFF_SINGLE,
  payload,
});

export const deleteStaff = (payload) => ({
  type: DELETE_STAFF,
  payload,
});

// appointments
export const getAppointments = (payload) => ({
  type: GET_STAFF_APPOINTMENTS,
  payload,
});

export const setAppointments = (payload) => ({
  type: SET_APPOINTMENTS,
  payload,
});

export const setAppointmentsPage = (payload) => ({
  type: SET_APPOINTMENTS_PAGE,
  payload,
});

export const setAppointmentsLoading = (payload) => ({
  type: SET_APPOINTMENTS_LOADING,
  payload,
});

export const setOrder = (payload) => ({
  type: SET_APPOINTMENTS_ORDER,
  payload,
});

// appointments reminders
export const getAppointmentsReminders = (payload) => ({
  type: GET_APPOINTMENTS_REMINDERS,
  payload,
});

export const setAppointmentsReminders = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS,
  payload,
});

export const setAppointmentsRemindersPage = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS_PAGE,
  payload,
});

export const setAppointmentsRemindersLoading = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS_LOADING,
  payload,
});

export const setAppointmentsRemindersOrder = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS_ORDER,
  payload,
});

export const cancelAppointmentReminder = (payload) => ({
  type: CANCEL_APPOINTMENT_REMINDER,
  payload,
});

export const reverseAppointmentReminderCancellation = (payload) => ({
  type: REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
  payload,
});

export const rescheduleAppointmentReminder = (payload) => ({
  type: RESCHEDULE_APPOINTMENT_REMINDER,
  payload,
});

// messages requiring immediate attention
export const getMessagesRequiringImmediateAttention = (payload) => ({
  type: GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  payload,
});

export const setMessagesRequiringImmediateAttention = (payload) => ({
  type: SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  payload,
});

export const setMessagesRequiringImmediateAttentionPage = (payload) => ({
  type: SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE,
  payload,
});

export const setMessagesRequiringImmediateAttentionLoading = (payload) => ({
  type: SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_LOADING,
  payload,
});

export const setMessagesRequiringImmediateAttentionOrder = (payload) => ({
  type: SET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_ORDER,
  payload,
});

// other
export const setScheduledStaffAppointmentsPage = (payload) => ({
  type: SET_SCHEDULED_STAFF_APPOINTMENTS_PAGE,
  payload,
});

export const setPastStaffAppointmentsPage = (payload) => ({
  type: SET_PAST_STAFF_APPOINTMENTS_PAGE,
  payload,
});
