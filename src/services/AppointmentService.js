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
  GET_APPOINTMENT_STATUSES: '/appointment-status/',
  GET_APPOINTMENT_COMMUNICATION_STATUSES: '/appointment-communication-status/',
  GET_APPOINTMENT_MISSING_REASONS: '/missing-reasons/',
  GET_APPOINTMENT_CANCELLATION_REASONS: '/cancellation-reasons/',
  GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES:
    '/messages-requiring-immediate-attention-statuses/',
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

  deleteAppointment = (id) =>
    this.apiClient.delete(`${ENDPOINTS.GET_APPOINTMENTS}${id}/`);

  updateAppointmentCommunicationStatus = ({ id, data }) =>
    this.apiClient.post(
      `${ENDPOINTS.GET_APPOINTMENTS}${id}/update-communication-status/`,
      data
    );

  cancelAppointment = ({ id, data }) =>
    this.apiClient.post(`${ENDPOINTS.GET_APPOINTMENTS}${id}/cancel/`, data);

  endAppointment = ({ id, data }) =>
    this.apiClient.post(`${ENDPOINTS.GET_APPOINTMENTS}${id}/end/`, data);

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

  getSinglePreAppointmentQuestionnaire = (id) =>
    this.apiClient.get(
      `${ENDPOINTS.GET_APPOINTMENTS}${id}/pre-appointment-questionnaire/answers/`
    );

  getClinicDoctors = () => this.apiClient.get(ENDPOINTS.GET_CLINIC_DOCTORS);

  getAppointmentTypes = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_TYPES);

  getAppointmentStatuses = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_STATUSES);

  getAppointmentCommunicationStatuses = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_COMMUNICATION_STATUSES);

  getAppointmentMissingReasons = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_MISSING_REASONS);

  getAppointmentCancellationReasons = () =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_CANCELLATION_REASONS);

  getMessageRequiringImmediateAttentionStatuses = () =>
    this.apiClient.get(
      ENDPOINTS.GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES
    );
}

const appointmentService = new AppointmentService();
export default appointmentService;
