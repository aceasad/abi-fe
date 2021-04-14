import ApiService from './ApiService';

const ENDPOINTS = {
  AVAILABLE_TIMESLOTS: '/appointments/available-appointments',
  CREATE_APPOINTMENT: '/appointments/',
  UPDATE_APPOINTMENT: '/appointments/:id',
  GET_DOCTOR_APPOINTMNETS: '/appointments/doctors/scheduled/',
  GET_DATE_APPOINTMENTS: '/appointments/month/count/',
  GET_APPOINTMENTS: '/appointments/',
};

class AppointmentService extends ApiService {
  createAppointment = (payload) => {
    console.log('tu sam!');
    return this.apiClient.post(ENDPOINTS.CREATE_APPOINTMENT, payload);
  };
  updateAppointment = (payload) =>
    this.apiClient.put(
      ENDPOINTS.UPDATE_APPOINTMENT.replace('id', payload.id),
      payload
    );
  getAvailabileTimeslots = () =>
    this.apiClient.get(ENDPOINTS.AVAILABLE_TIMESLOTS, {
      params: {},
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
}

const appointmentService = new AppointmentService();
export default appointmentService;
