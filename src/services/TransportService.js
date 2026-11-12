import ApiService from './ApiService';

const ENDPOINTS = {
  STAFF_TRIPS: '/transport/booking/staff/trips/',
  STAFF_TRIPS_CANCEL: '/transport/booking/staff/trips/cancel/',
  SERVICE_TYPES: '/transport/booking/service-types/',
};

class TransportService extends ApiService {
  // params: start_date, end_date, appointment_type_id, trip_type, status, patient_id, search, limit, offset
  getStaffTrips = (params = {}) =>
    this.apiClient.get(ENDPOINTS.STAFF_TRIPS, { params });

  // Cancels the ride(s) only - the appointment(s) stay booked.
  cancelStaffTrips = (appointmentIds) =>
    this.apiClient.post(ENDPOINTS.STAFF_TRIPS_CANCEL, {
      appointment_ids: appointmentIds,
    });

  getServiceTypes = (appointmentId) =>
    this.apiClient.get(ENDPOINTS.SERVICE_TYPES, {
      params: { appointment_id: appointmentId },
    });

  bookStaffTrip = (payload) => this.apiClient.post(ENDPOINTS.STAFF_TRIPS, payload);
}

const transportService = new TransportService();
export default transportService;
