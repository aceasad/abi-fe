import ApiService from './ApiService';

const ENDPOINTS = {
  GET_DOCTOR_APPOINTMNETS: '/appointments/doctors/scheduled/',
  GET_DATE_APPOINTMENTS: '/appointments/month/count/',
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
}
const appointmentService = new AppointmentService();
export default appointmentService;
