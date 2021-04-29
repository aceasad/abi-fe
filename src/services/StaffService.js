import { ORDERING } from 'constants/ApiConstant';
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_STAFF: '/staffs/',
  GET_STAFF_DETAILS: '/staffs/staff-details/',
  GET_APPOINTMENTS: {
    [SCHEDULED]: '/appointments/staff-scheduled-appointments/',
    [HISTORY]: '/appointments/staff-passed-appointments/',
  },
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
  getStaffDetails = () => this.apiClient.get(ENDPOINTS.GET_STAFF_DETAILS);
  createStaff = (payload) => this.apiClient.post(ENDPOINTS.GET_STAFF, payload);
  updateStaff = (payload) =>
    this.apiClient.put(ENDPOINTS.GET_STAFF + payload.get('id') + '/', payload);
  getSingleStaff = (payload) =>
    this.apiClient.get(ENDPOINTS.GET_STAFF + payload + '/');
  deleteStaff = (payload) =>
    this.apiClient.delete(ENDPOINTS.GET_STAFF + payload + '/');

  getAppointments = (id, { order, field, page }, state_field) =>
    this.apiClient.get(`${ENDPOINTS.GET_APPOINTMENTS[state_field]}${id}/`, {
      params: {
        ordering: field
          .split(',')
          .map((part) => `${order === ORDERING.DESC ? '-' : ''}${part}`)
          .join(),
        limit: DEFAULT_LIMIT,
        offset: (page - 1) * DEFAULT_LIMIT,
      },
    });
}

const staffService = new StaffService();
export default staffService;
