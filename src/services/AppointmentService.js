import ApiService from './ApiService';

const ENDPOINTS = {
  GET_DOCTOR_APPOINTMNETS: '/appointments/doctors/scheduled/',
  GET_DATE_APPOINTMENTS: '/appointments/month/count/',
  GET_APPOINTMENTS: '/appointments/',
  GET_MISSING_REASONS: '/missing-reasons/',
};

class AppointmentService extends ApiService {
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

  deleteAppointment = (id) =>
    this.apiClient.delete(`${ENDPOINTS.GET_APPOINTMENTS}${id}/`);

  getMissingReasons = () => this.apiClient.get(ENDPOINTS.GET_MISSING_REASONS);

  endAppointemnt = ({ id, data }) =>
    this.apiClient.post(`${ENDPOINTS.GET_APPOINTMENTS}${id}/end/`, data);
}
const appointmentService = new AppointmentService();
export default appointmentService;
