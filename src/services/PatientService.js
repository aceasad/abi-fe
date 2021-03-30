import { DEFAULT_PAGINATION_LIMIT, ORDERING } from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_PATIENTS: '/patients/',
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
}

const patientService = new PatientService();
export default patientService;
