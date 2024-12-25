import ApiService from './ApiService';

const ENDPOINTS = {
  GET_OVERVIEW_SUMMARY_DATA: '/industry_averages/summary/',
  GET_OVERVIEW_CLINICSTATS_DATA: '/clinic_stats/getClinicStatsbyMonth/',
};

class OverviewService extends ApiService {
  getSummaryData = (interval) =>
    this.apiClient.get(ENDPOINTS.GET_OVERVIEW_SUMMARY_DATA, {
      params: { interval },
    });
  getClinicStatsData = (month) =>
    this.apiClient.get(ENDPOINTS.GET_OVERVIEW_CLINICSTATS_DATA, {
      params: { month },
    });
}

const overviewService = new OverviewService();
export default overviewService;
