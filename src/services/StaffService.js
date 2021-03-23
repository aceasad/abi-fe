import ApiService from './ApiService';

const ENDPOINTS = {
  GET_STAFF: '/staffs/',
};

export const DEFAULT_LIMIT = 10;

class StaffService extends ApiService {
  getStaff = () => this.apiClient.get(ENDPOINTS.GET_STAFF);
  getPaginatedStaff = ({ page }) =>
    this.apiClient.get(ENDPOINTS.GET_STAFF, {
      params: {
        limit: DEFAULT_LIMIT,
        offset: (page - 1) * DEFAULT_LIMIT,
      },
    });
}

const staffService = new StaffService();
export default staffService;
