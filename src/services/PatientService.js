import { DEFAULT_PAGINATION_LIMIT, ORDERING } from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_PATIENTS: '/patients/',
  GET_PATIENT_DETAILS: '/patients/patient-details/',
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

  updatePatient = (data) =>
    this.apiClient.put(ENDPOINTS.GET_PATIENTS + data.id + '/', data);
}

const patientService = new PatientService();
export default patientService;
