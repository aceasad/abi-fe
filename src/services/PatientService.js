import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_SMALL_PAGINATION_LIMIT,
  ORDERING,
} from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_PATIENTS: '/patients/',
  GET_PATIENT_DETAILS: '/patients/patient-details/',
  GET_SCHEDULED_APPOINTMENTS: '/appointments/scheduled-appointments/',
  GET_APPOINTMENT_HISTORY: '/appointments/passed-appointments/',
};

class PatientService extends ApiService {
  getPatients = ({ page = 1, order, field, search }) =>
    this.apiClient.get(ENDPOINTS.GET_PATIENTS, {
      params: {
        limit: DEFAULT_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_PAGINATION_LIMIT,
        ordering: `${order === ORDERING.DESC ? '-' : ''}${field}`,
        search,
      },
    });

  deletePatient = (id) =>
    this.apiClient.delete(ENDPOINTS.GET_PATIENTS + id + '/');

  getPatientDetails = () => this.apiClient.get(ENDPOINTS.GET_PATIENT_DETAILS);

  createPatient = (data) => this.apiClient.post(ENDPOINTS.GET_PATIENTS, data);
  getPatientSingle = (id) =>
    this.apiClient.get(ENDPOINTS.GET_PATIENTS + id + '/');

  updatePatient = (id, data) =>
    this.apiClient.put(ENDPOINTS.GET_PATIENTS + id + '/', data);

  getScheduledAppointments = (id, { field, page = 1 }) =>
    this.apiClient.get(ENDPOINTS.GET_SCHEDULED_APPOINTMENTS + id + '/', {
      params: {
        ordering: field,
        limit: DEFAULT_SMALL_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
      },
    });

  getAppointmentHistory = (id, page) =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_HISTORY + id + '/', {
      params: {
        limit: DEFAULT_SMALL_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
      },
    });

  updatePatientPart = (id, data) =>
    this.apiClient.patch(ENDPOINTS.GET_PATIENTS + id + '/', data);
}

const patientService = new PatientService();
export default patientService;
