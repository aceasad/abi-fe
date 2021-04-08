import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_USERS: '/users/',
};

class UserService extends ApiService {
  getUsers = (page) =>
    this.apiClient.get(ENDPOINTS.GET_USERS, {
      params: {
        limit: DEFAULT_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_PAGINATION_LIMIT,
      },
    });

  createUser = (payload) => this.apiClient.post(ENDPOINTS.GET_USERS, payload);

  updateUser = (payload) =>
    this.apiClient.put(`${ENDPOINTS.GET_USERS}${payload.id}/`, payload);

  getSingleUser = (payload) =>
    this.apiClient.get(`${ENDPOINTS.GET_USERS}${payload}/`);

  deleteUser = (payload) =>
    this.apiClient.delete(`${ENDPOINTS.GET_USERS}${payload}/`);
}
const userService = new UserService();
export default userService;
