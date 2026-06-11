import {
  DEFAULT_PAGINATION_LIMIT,
  MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE_SIZE,
  ORDERING,
} from 'constants/ApiConstant';
import {
  HISTORY,
  SCHEDULED,
  LIKELY_TO_BE_MISSED,
  UPCOMING_REMINDERS_APPOINTMENT,
  UPCOMING_REMINDERS_SYSTEM,
  HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE,
  MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
} from 'redux/reducers/Staff';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_STAFF: '/staffs/',
  GET_STAFF_DETAILS: '/staffs/staff-details/',
  GET_APPOINTMENTS: {
    [SCHEDULED]: '/appointments/staff-scheduled-appointments/',
    [HISTORY]: '/appointments/staff-passed-appointments/',
    [LIKELY_TO_BE_MISSED]: '/appointments/likely-to-be-missed/',
    [HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE]:
      '/appointments/passed-requiring-immediate-status-update/',
  },
  GET_APPOINTMENTS_REMINDERS: {
    [UPCOMING_REMINDERS_APPOINTMENT]: '/appointments/reminders/upcoming/',
    [UPCOMING_REMINDERS_SYSTEM]: '/appointments/reminders/upcoming/',
  },
  GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION: {
    [MESSAGES_REQUIRING_IMMEDIATE_ATTENTION]:
      '/messages-requiring-immediate-attention/all/',
  },
  UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION:
    '/messages-requiring-immediate-attention/',
  APPOINTMENTS_REMINDERS: '/appointments/reminders/',
};

export const DEFAULT_LIMIT = 10;

class StaffService extends ApiService {
  getStaff = () => this.apiClient.get(ENDPOINTS.GET_STAFF);
  getPaginatedStaff = ({ page }) =>
    this.apiClient.get(ENDPOINTS.GET_STAFF, {
      params: {
        limit: DEFAULT_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_PAGINATION_LIMIT,
      },
    });
  getStaffDetails = () => this.apiClient.get(ENDPOINTS.GET_STAFF_DETAILS);
  createStaff = (payload) => this.apiClient.post(ENDPOINTS.GET_STAFF, payload);
  updateStaff = (payload) =>
    this.apiClient.put(ENDPOINTS.GET_STAFF + payload.get('id') + '/', payload);
  getSingleStaff = (payload) =>
    this.apiClient.get(ENDPOINTS.GET_STAFF + payload + '/');
  deleteStaff = (payload) =>
    this.apiClient.delete(ENDPOINTS.GET_STAFF + payload + '/');

  getAppointments = (id, { order, field, page }, state_field) =>
    this.apiClient.get(
      !id
        ? `${ENDPOINTS.GET_APPOINTMENTS[state_field]}`
        : `${ENDPOINTS.GET_APPOINTMENTS[state_field]}${id}/`,
      {
        params: {
          ordering: field
            .split(',')
            .map((part) => `${order === ORDERING.DESC ? '-' : ''}${part}`)
            .join(),
          limit: DEFAULT_PAGINATION_LIMIT,
          offset: (page - 1) * DEFAULT_PAGINATION_LIMIT,
        },
      }
    );

  getAppointmentsReminders = (id, { order, field, page }, params, state_field) =>
    this.apiClient.get(
      !id
        ? `${ENDPOINTS.GET_APPOINTMENTS_REMINDERS[state_field]}`
        : `${ENDPOINTS.GET_APPOINTMENTS_REMINDERS[state_field]}${id}/`,
      {
        params: {
          ordering: field
            .split(',')
            .map((part) => `${order === ORDERING.DESC ? '-' : ''}${part}`)
            .join(),
          limit: DEFAULT_PAGINATION_LIMIT,
          offset: (page - 1) * DEFAULT_PAGINATION_LIMIT,
          ...params
        },
      }
    );

  getMessagesRequiringImmediateAttention = (
    id,
    { order, field, page, pageSize = MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE_SIZE },
    state_field
  ) =>
    this.apiClient.get(
      !id
        ? `${ENDPOINTS.GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION[state_field]}`
        : `${ENDPOINTS.GET_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION[state_field]}`,
      {
        params: {
          ordering: field
            .split(',')
            .map((part) => `${order === ORDERING.DESC ? '-' : ''}${part}`)
            .join(),
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      }
    );

  cancelAppointmentReminder = (payload) =>
    this.apiClient.post(
      `${ENDPOINTS.APPOINTMENTS_REMINDERS}${payload}/cancel/`
    );

  reverseAppointmentReminderCancellation = (payload) =>
    this.apiClient.post(
      `${ENDPOINTS.APPOINTMENTS_REMINDERS}${payload}/reverse-cancellation/`
    );

  rescheduleAppointmentReminder = (payload) =>
    this.apiClient.post(
      `${ENDPOINTS.APPOINTMENTS_REMINDERS}${payload.id}/reschedule/`,
      payload.send_now
        ? {
          send_now: true,
        }
        : {
          new_reminder_datetime: payload.new_reminder_datetime,
        }
    );

  updateMessageRequiringImmediateAttention = (payload) => {
    const { id, ...updatedPayload } = payload;
    this.apiClient.patch(
      `${ENDPOINTS.UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION}${id}/`,
      updatedPayload
    );

  }
}

const staffService = new StaffService();
export default staffService;
