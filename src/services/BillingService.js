import ApiService from './ApiService';

const ENDPOINTS = {
  STATUS: '/billing/status/',
  LEDGER: '/billing/ledger/',
  INVOICES: '/billing/invoices/',
  USAGE_DASHBOARD: '/billing/usage-dashboard/',
  USAGE: '/billing/usage/',
  ONBOARD: '/billing/connect/onboard/',
  ATTACH: '/billing/connect/attach/',
  REFRESH: '/billing/connect/refresh/',
  DASHBOARD: '/billing/connect/dashboard/',
  COPAY_TEMPLATE: '/billing/copay-requests/template/',
  COPAY_VALIDATE: '/billing/copay-requests/validate/',
  COPAY_REQUESTS: '/billing/copay-requests/',
};

class BillingService extends ApiService {
  getStatus = () => this.apiClient.get(ENDPOINTS.STATUS);

  getLedger = () => this.apiClient.get(ENDPOINTS.LEDGER);

  getInvoices = () => this.apiClient.get(ENDPOINTS.INVOICES);

  getUsageDashboard = () => this.apiClient.get(ENDPOINTS.USAGE_DASHBOARD);

  getUsage = (start, end, grain) =>
    this.apiClient.get(ENDPOINTS.USAGE, { params: { start, end, grain } });

  payInvoice = (invoiceId) => this.apiClient.post(`/billing/invoices/${invoiceId}/pay/`);

  downloadInvoice = (invoiceId) =>
    this.apiClient.get(`/billing/invoices/${invoiceId}/pdf/`, { responseType: 'blob' });

  startOnboarding = () => this.apiClient.post(ENDPOINTS.ONBOARD);

  attachAccount = (stripeAccountId) =>
    this.apiClient.post(ENDPOINTS.ATTACH, {
      stripe_account_id: stripeAccountId,
    });

  refreshStatus = () => this.apiClient.post(ENDPOINTS.REFRESH);

  openDashboard = () => this.apiClient.post(ENDPOINTS.DASHBOARD);

  getCopayTemplate = () => this.apiClient.get(ENDPOINTS.COPAY_TEMPLATE);

  validateCopayRequest = (rows) => this.apiClient.post(ENDPOINTS.COPAY_VALIDATE, { rows });

  createCopayRequest = (rows, idempotencyKey, sourceFilename = '') =>
    this.apiClient.post(ENDPOINTS.COPAY_REQUESTS, {
      rows,
      idempotency_key: idempotencyKey,
      source_filename: sourceFilename,
    });
}

const billingService = new BillingService();

export default billingService;
