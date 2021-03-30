import ApiService from './ApiService';

const ENDPOINTS = {
  UPDATE_INDUSTRY_AVERAGE: '/industry_averages/',
};

class IndustryAverageService extends ApiService {
  updateIndustryAverge = (values) => {
    return this.apiClient.put(
      ENDPOINTS.UPDATE_INDUSTRY_AVERAGE + values.id + '/',

      values
    );
  };
  createIndustryAverage = (values) => {
    const data = this.apiClient.post(ENDPOINTS.UPDATE_INDUSTRY_AVERAGE, values);
    return data;
  };
  getIndustryAverage = () => {
    return this.apiClient.get(ENDPOINTS.UPDATE_INDUSTRY_AVERAGE);
  };
}
const industryAverage = new IndustryAverageService();
export default industryAverage;
