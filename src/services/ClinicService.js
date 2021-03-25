import ApiService from './ApiService';

const ENDPOINTS = {
  UPDATE_CLINIC: '/clinics/',
};

export const create_clinic = (values) => {
  const clinic = new FormData();
  Object.keys(values).map((key) => {
    if (values[key]) {
      clinic.append(key, values[key]);
    }
  });
  return clinic;
};

class ClinicService extends ApiService {
  updateClinic = (values) => {
    const clinic = create_clinic(values);
    const data = this.apiClient.post(ENDPOINTS.UPDATE_CLINIC, clinic);
    return data;
  };
}
const clinicService = new ClinicService();
export default clinicService;
