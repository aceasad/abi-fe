import ApiService from './ApiService';

const ENDPOINTS = {
  AVAILABLE_TIMESLOTS: '/appointments/available-appointments',
  CREATE_APPOINTMENT: '/appointments/',
  UPDATE_APPOINTMENT: '/appointments/:id',
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
}

const appointmentService = new AppointmentService();
export default appointmentService;
