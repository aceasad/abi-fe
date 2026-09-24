import ApiService from './ApiService';

const ENDPOINTS = {
  GET_OVERVIEW_SUMMARY_DATA: '/industry_averages/summary/',
  GET_OVERVIEW_CLINICSTATS_DATA: '/industry_averages/get-kpi/',
  GET_KPI_FUNNEL: '/industry_averages/get-kpi-funnel/',
  GET_KPI_BOOKING_STATUSES: '/industry_averages/get-kpi-booking-statuses/',
  GET_KPI_INTERVENTIONS: '/industry_averages/get-kpi-interventions/',
  DOWNLOAD_CLINICSTATS_DATA: '/industry_averages/download-kpi/',
  GET_FAILED_MESSAGES: '/industry_averages/failed-messages/',
  GET_MESSAGES_BEFORE_MILESTONES: '/industry_averages/messages-before-milestones/',

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
  getKpiFunnel = (start_time, end_time, campaign_id) =>
    this.apiClient.get(ENDPOINTS.GET_KPI_FUNNEL, {
      params: { start_time, end_time, campaign_id },
    });
  getKpiBookingStatuses = (start_time, end_time, campaign_id) =>
    this.apiClient.get(ENDPOINTS.GET_KPI_BOOKING_STATUSES, {
      params: { start_time, end_time, campaign_id },
    });
  getKpiInterventions = (start_time, end_time, campaign_id) =>
    this.apiClient.get(ENDPOINTS.GET_KPI_INTERVENTIONS, {
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
  getMessagesBeforeMilestones = (start_time, end_time, campaign_id) =>
    this.apiClient.get(ENDPOINTS.GET_MESSAGES_BEFORE_MILESTONES, {
      params: { start_time, end_time, campaign_id },
    });

}

const overviewService = new OverviewService();
export default overviewService;
