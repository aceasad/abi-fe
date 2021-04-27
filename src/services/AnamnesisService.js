import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_EXISTING_CONDITIONS: '/patients/:id/medical-conditions/',
  GET_PREVIOUS_OPERATIONS: '/patients/:id/operations/',
  GET_ORGANIZATION_TYPES:
    '/operation-types-search/?search=:text&organization=:id',
  POST_OPERATION_TYPES: '/operation-types/',
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

  getOrganizationTypes = ({ organization, data }) =>
    this.apiClient.get(
      ENDPOINTS.GET_ORGANIZATION_TYPES.replace(':id', organization).replace(
        ':text',
        data
      )
    );

  getNextOrganizationTypePage = (next) => this.apiClient.get(next);

  addOperationType = (name) =>
    this.apiClient.post(ENDPOINTS.POST_OPERATION_TYPES, { name });

  deleteOperationType = (id) =>
    this.apiClient.delete(ENDPOINTS.POST_OPERATION_TYPES + id + '/');
}
const anamnesisService = new AnamnesisService();
export default anamnesisService;
