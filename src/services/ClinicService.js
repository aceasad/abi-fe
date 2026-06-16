import ApiService from './ApiService';

const ENDPOINTS = {
  CREATE_CLINIC: '/clinics/',
  UPDATE_CLINIC: '/clinics/:id/',
  GET_CLINIC: '/clinics/',
  GET_USERS_CLINIC: '/clinics/my-clinic/',
  ADVANCED_SETTINGS: '/clinics/advanced-settings/',
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

  getAdvancedSettings = () => {
    return this.apiClient.get(ENDPOINTS.ADVANCED_SETTINGS);
  };

  updateAdvancedSettings = (settings) => {
    return this.apiClient.patch(ENDPOINTS.ADVANCED_SETTINGS, settings);
  };
}
const clinicService = new ClinicService();
export default clinicService;
