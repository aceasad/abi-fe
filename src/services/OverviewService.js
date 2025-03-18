import ApiService from './ApiService';

const ENDPOINTS = {
  GET_OVERVIEW_SUMMARY_DATA: '/industry_averages/summary/',
  GET_OVERVIEW_CLINICSTATS_DATA: '/industry_averages/get-kpi/',
  DOWNLOAD_CLINICSTATS_DATA: '/industry_averages/download-kpi/',

};

class OverviewService extends ApiService {
  getSummaryData = (interval) =>
    this.apiClient.get(ENDPOINTS.GET_OVERVIEW_SUMMARY_DATA, {
      params: { interval },
    });
  getClinicStatsData = (start_time, end_time) =>
    this.apiClient.get(ENDPOINTS.GET_OVERVIEW_CLINICSTATS_DATA, {
      params: { start_time, end_time },
    });
  downloadClinicStatsData = (start_time, end_time) =>
    this.apiClient.get(ENDPOINTS.DOWNLOAD_CLINICSTATS_DATA, {
      params: { start_time, end_time },
      responseType: 'blob'
    });

}

const overviewService = new OverviewService();
export default overviewService;
