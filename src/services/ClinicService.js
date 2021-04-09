import ApiService from './ApiService';

const ENDPOINTS = {
  CREATE_CLINIC: '/clinics/',
  UPDATE_CLINIC: '/clinics/:id/',
  GET_CLINIC: '/clinics/',
  GET_USERS_CLINIC: '/clinics/my-clinic',
};

class ClinicService extends ApiService {
  createClinic = (clinic) => {
    return this.apiClient.post(ENDPOINTS.CREATE_CLINIC, clinic);
  };

  updateClinic = (updatedClinic, id) => {
    return this.apiClient.put(
      ENDPOINTS.UPDATE_CLINIC.replace(':id', id),
      updatedClinic
    );
  };

  getClinic = () => {
    return this.apiClient.get(ENDPOINTS.GET_USERS_CLINIC);
  };
}
const clinicService = new ClinicService();
export default clinicService;
