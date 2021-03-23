import ApiService from './ApiService';

const ENDPOINTS = {
  GET_STAFF: '/staffs/',
};

class StaffService extends ApiService {
  getStaff = () => this.apiClient.get(ENDPOINTS.GET_STAFF);
}

const staffService = new StaffService();
export default staffService;
