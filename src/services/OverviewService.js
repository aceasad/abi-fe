import ApiService from './ApiService';

const ENDPOINTS = {
  GET_OVERVIEW_SUMMARY_DATA: '/industry_averages/summary/',
  GET_OVERVIEW_CLINICSTATS_DATA: '/industry_averages/get-kpi/',
  DOWNLOAD_CLINICSTATS_DATA: '/industry_averages/download-kpi/',
  GET_FAILED_MESSAGES: '/industry_averages/failed-messages/',

};

class OverviewService extends ApiService {
  getSummaryData = (interval) =>
    this.apiClient.get(ENDPOINTS.GET_OVERVIEW_SUMMARY_DATA, {
      params: { interval },
    });
  getClinicStatsData = (start_time, end_time, campaign_id) =>
    this.apiClient.get(ENDPOINTS.GET_OVERVIEW_CLINICSTATS_DATA, {
      params: { start_time, end_time, campaign_id },
    });
  downloadClinicStatsData = (start_time, end_time, campaign_id) =>
    this.apiClient.get(ENDPOINTS.DOWNLOAD_CLINICSTATS_DATA, {
      params: { start_time, end_time, campaign_id },
      responseType: 'blob'
    });
  getFailedMessages = (start_time, end_time, campaign_id, limit, offset) =>
    this.apiClient.get(ENDPOINTS.GET_FAILED_MESSAGES, {
      params: { start_time, end_time, campaign_id, limit, offset },
    });

}

const overviewService = new OverviewService();
export default overviewService;
