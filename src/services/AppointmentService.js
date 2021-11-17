import ApiService from './ApiService';
import moment from 'moment';

const ENDPOINTS = {
  AVAILABLE_TIMESLOTS: '/appointments/timeslots/available/',
  CREATE_APPOINTMENT: '/appointments/',
  UPDATE_APPOINTMENT: '/appointments/:id/',
  GET_DOCTOR_APPOINTMNETS: '/appointments/doctors/scheduled/',
  GET_DATE_APPOINTMENTS: '/appointments/month/count/',
  GET_APPOINTMENTS: '/appointments/',
  GET_CLINIC_DOCTORS: '/staff/',
  GET_APPOINTMENT_TYPES: '/appointment-types/',
  GET_APPOINTMENT_STATUS: '/appointment-status/',
  GET_MISSING_REASONS: '/missing-reasons/',
  GET_APPOINTMENTS_REMINDERS_PAGE: '/appointments/reminders/',
  CANCEL_APPOINTMENT_REMINDER: '/appointments/reminders/:id/cancel/',
  REVERSE_APPOINTMENT_REMINDER_CANCELLATION:
    '/appointments/reminders/:id/reverse-cancellation/',
};

class AppointmentService extends ApiService {
  createAppointment = (payload) => {
    return this.apiClient.post(ENDPOINTS.CREATE_APPOINTMENT, payload.data);
  };

  updateAppointment = (payload) =>
    this.apiClient.put(
      ENDPOINTS.UPDATE_APPOINTMENT.replace(':id', payload.id),
      payload.data
    );

  getAvailabileTimeslots = (doctor, patient, appointmentType, date) =>
    this.apiClient.get(ENDPOINTS.AVAILABLE_TIMESLOTS, {
      params: {
        doctor,
        patient,
        appointment_type: appointmentType,
        date: moment(date).format('YYYY-MM-DD'),
      },
    });

  getDoctorAppointments = (date) =>
    this.apiClient.get(ENDPOINTS.GET_DOCTOR_APPOINTMNETS, {
      params: {
        date,
      },
    });

  getDateAppointments = ({ year, month }) =>
    this.apiClient.get(ENDPOINTS.GET_DATE_APPOINTMENTS, {
      params: {
        year,
        month,
      },
    });

  getSingleAppointment = (id) =>
    this.apiClient.get(`${ENDPOINTS.GET_APPOINTMENTS}${id}/`);

  getClinicDoctors = () => this.apiClient.get(ENDPOINTS.GET_CLINIC_DOCTORS);

  getAppointmentTypes = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_TYPES);

  getAppointmentStatus = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_STATUS);
  deleteAppointment = (id) =>
    this.apiClient.delete(`${ENDPOINTS.GET_APPOINTMENTS}${id}/`);

  getMissingReasons = () => this.apiClient.get(ENDPOINTS.GET_MISSING_REASONS);

  endAppointment = ({ id, data }) =>
    this.apiClient.post(`${ENDPOINTS.GET_APPOINTMENTS}${id}/end/`, data);

  getAppointmentsReminders = (status) =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENTS_REMINDERS_PAGE, {
      params: { status },
    });

  cancelAppointmentReminder = (payload) =>
    this.apiClient.post(
      ENDPOINTS.CANCEL_APPOINTMENT_REMINDER.replace(':id', payload.id),
      payload.data
    );

  reverseAppointmentReminderCancellation = (payload) =>
    this.apiClient.post(
      ENDPOINTS.REVERSE_APPOINTMENT_REMINDER_CANCELLATION.replace(
        ':id',
        payload.id
      ),
      payload.data
    );
}

const appointmentService = new AppointmentService();
export default appointmentService;
