import ApiService from './ApiService';

const ENDPOINTS = {
  UPDATE_INDUSTRY_AVERAGE: '/industry_averages/',
};

class IndustryAverageService extends ApiService {
  updateIndustryAverge = (values) => {
    this.apiClient.post(ENDPOINTS.UPDATE_INDUSTRY_AVERAGE, values);
  };
  getIndustryAverage = () => {
    this.apiClient.get(ENDPOINTS.UPDATE_INDUSTRY_AVERAGE);
  };
}
const industryAverage = new IndustryAverageService();
export default industryAverage;
