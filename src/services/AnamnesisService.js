import {
  DEFAULT_SMALL_PAGINATION_LIMIT,
  LARGE_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_EXISTING_CONDITIONS: '/patients/:id/medical-conditions/',
  GET_PREVIOUS_OPERATIONS: '/patients/:id/operations/',
  SEARCH_MEDICAL_CONDITIONS: '/medical-conditions-search/',
  CREATE_MEDICAL_CONDITION: '/medical-conditions/',
  DELETE_MEDICAL_CONDITION: '/medical-conditions/:id/',
  GET_ORGANIZATION_TYPES:
    '/operation-types-search/?search=:text&organization=:id',
  POST_OPERATION_TYPES: '/operation-types/',
};

class AnamnesisService extends ApiService {
  getExistingConditions = ({ page = 1 }, id, noLimit = false) =>
    this.apiClient.get(ENDPOINTS.GET_EXISTING_CONDITIONS.replace(':id', id), {
      params: {
        limit: noLimit ? MAX_PAGINATION_LIMIT : LARGE_PAGINATION_LIMIT,
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
  searchMedicalConditions = (organizationId, query, next = null) =>
    next
      ? this.apiClient.get(next)
      : this.apiClient.get(ENDPOINTS.SEARCH_MEDICAL_CONDITIONS, {
          params: {
            organization: organizationId,
            search: query,
          },
        });

  createMedicalCondition = (payload) =>
    this.apiClient.post(ENDPOINTS.CREATE_MEDICAL_CONDITION, payload);

  deleteMedicalCondition = (id) =>
    this.apiClient.delete(
      ENDPOINTS.DELETE_MEDICAL_CONDITION.replace(':id', id)
    );

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
