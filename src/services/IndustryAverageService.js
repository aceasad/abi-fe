import ApiService from './ApiService';

const ENDPOINTS = {
  UPDATE_INDUSTRY_AVERAGE: '/industry_averages/',
};

class IndustryAverageService extends ApiService {
  updateIndustryAverge = (values) => {
    const data = this.apiClient.post(ENDPOINTS.UPDATE_INDUSTRY_AVERAGE, values);
    return data;
  };
  getIndustryAverage = () => {
    const data = this.apiClient.get(ENDPOINTS.UPDATE_INDUSTRY_AVERAGE);
    return data;
  };
}
const industryAverage = new IndustryAverageService();
export default industryAverage;
