import ApiService from "./ApiService";

const ENDPOINTS = {
  UPDATE_CLINIC: "/clinics/",
};

class ClinicService extends ApiService {
  updateClinic = (values) => {
    const clinic = new FormData();
    clinic.append("name", values.name);
    clinic.append("phone_number", values.phone_number);
    clinic.append("address", values.address);
    clinic.append("google_maps_link", values.google_map_link);
    clinic.append("parking_availability", values.parkign_availability);
    clinic.append("parking_size", values.parking_size);
    clinic.append("photo", values.photo);
    clinic.append("start_of_work", values.start_of_work);
    clinic.append("end_of_work", values.end_of_work);

    return this.apiClient.post(ENDPOINTS.UPDATE_CLINIC, clinic);
  };
}
const clinicService = new ClinicService();
export default clinicService;
