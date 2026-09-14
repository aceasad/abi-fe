import ApiService from './ApiService';

const ENDPOINTS = {
  STAFF_TRIPS: '/transport/booking/staff/trips/',
  STAFF_TRIPS_CANCEL: '/transport/booking/staff/trips/cancel/',
};

class TransportService extends ApiService {
  // params: start_date, end_date, appointment_type_id, patient_id, search, limit, offset
  getStaffTrips = (params = {}) =>
    this.apiClient.get(ENDPOINTS.STAFF_TRIPS, { params });

  // Cancels the ride(s) only - the appointment(s) stay booked.
  cancelStaffTrips = (appointmentIds) =>
    this.apiClient.post(ENDPOINTS.STAFF_TRIPS_CANCEL, {
      appointment_ids: appointmentIds,
    });
}

const transportService = new TransportService();
export default transportService;
