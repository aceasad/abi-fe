import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_EXISTING_CONDITIONS: '/patients/:id/medical-conditions/',
  GET_PREVIOUS_OPERATIONS: '/patients/:id/operations/',
};

class AnamnesisService extends ApiService {
  getExistingConditions = ({ page = 1 }, id) =>
    this.apiClient.get(ENDPOINTS.GET_EXISTING_CONDITIONS.replace(':id', id), {
      params: {
        limit: DEFAULT_SMALL_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
      },
    });

  getPreviousOperations = ({ page = 1 }, id) =>
    this.apiClient.get(ENDPOINTS.GET_PREVIOUS_OPERATIONS.replace(':id', id), {
      params: {
        limit: DEFAULT_SMALL_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
      },
    });
}
const anamnesisService = new AnamnesisService();
export default anamnesisService;
