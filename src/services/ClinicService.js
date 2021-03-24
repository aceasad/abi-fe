import ApiService from './ApiService';

const ENDPOINTS = {
  UPDATE_CLINIC: '/clinics/',
};

export const create_clinic = (values) => {
  const clinic = new FormData();
  clinic.append('name', values.name);
  clinic.append('phone_number', values.phone_number);
  clinic.append('address', values.address);
  clinic.append('google_maps_link', values.google_maps_link);
  clinic.append('parking_availability', values.parking_availability);
  clinic.append('parking_size', values.parking_size);
  if (values.photo) {
    clinic.append('photo', values.photo);
  }
  if (values.start_of_work) {
    clinic.append('start_of_work', values.start_of_work);
  }
  if (values.end_of_work) {
    clinic.append('end_of_work', values.end_of_work);
  }
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
