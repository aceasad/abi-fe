import ApiService from './ApiService';

const ENDPOINTS = {
  LOCATIONS: '/locations/',
  LOCATION_DETAIL: '/locations/:id/',
};

class LocationService extends ApiService {
  listLocations = () => {
    return this.apiClient.get(ENDPOINTS.LOCATIONS);
  };

  createLocation = (payload) => {
    return this.apiClient.post(ENDPOINTS.LOCATIONS, payload);
  };

  updateLocation = (id, payload) => {
    return this.apiClient.patch(
      ENDPOINTS.LOCATION_DETAIL.replace(':id', id),
      payload
    );
  };

  deleteLocation = (id) => {
    return this.apiClient.delete(ENDPOINTS.LOCATION_DETAIL.replace(':id', id));
  };
}

const locationService = new LocationService();
export default locationService;
