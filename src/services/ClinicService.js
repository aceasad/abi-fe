import ApiService from './ApiService';

const ENDPOINTS = {
  CREATE_CLINIC: '/clinics/',
  UPDATE_CLINIC: '/clinics/:id/',
  GET_CLINIC: '/clinics/',
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
  createClinic = (values) => {
    const clinic = create_clinic(values);
    const data = this.apiClient.post(ENDPOINTS.CREATE_CLINIC, clinic);
    return data;
  };

  updateClinic = (updatedClinic, id) => {
    const clinic = create_clinic(updatedClinic);
    return this.apiClient.put(
      ENDPOINTS.UPDATE_CLINIC.replace(':id', id),
      clinic
    );
  };

  getClinic = () => {
    return this.apiClient.get(ENDPOINTS.GET_CLINIC);
  };
}
const clinicService = new ClinicService();
export default clinicService;
