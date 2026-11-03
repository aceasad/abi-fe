export const ONBOARDING_STATUS = {
  not_started: 'Not started',
  pending: 'Onboarding in progress',
  active: 'Active',
  restricted: 'Restricted',
};

const ERROR_MESSAGES = {
  billing_disabled: 'Billing is turned off on this environment.',
  stripe_not_configured: 'Stripe is not configured on this environment.',
  stripe_live_key_in_sandbox:
    'Sandbox mode rejected a live Stripe key.',
  stripe_test_key_in_live: 'Live mode rejected a test Stripe key.',
  invalid_stripe_account: 'That Stripe account id was not accepted.',
  stripe_account_missing: 'Connect a Stripe account before refreshing.',
  stripe_refresh_failed: 'Stripe could not refresh this account. Try again.',
  stripe_connect_not_enabled:
    'Stripe Connect is not enabled on this sandbox. Enable Connect, then try again.',
  stripe_onboard_failed: 'Stripe could not start onboarding. Try again.',
  stripe_dashboard_link_failed: 'Stripe could not open the dashboard. Try again.',
  stripe_account_not_ready: 'Connect Stripe and finish onboarding before sending a co-pay request.',
  patient_not_found: 'No patient in this clinic has that external identification number.',
  appointment_required: 'This patient has more than one upcoming visit. Add the appointment id.',
  appointment_not_found: 'That appointment was not found for this patient.',
  amount_invalid: 'Amount must be a dollar value of at least 0.50.',
  copay_template_missing: 'The payment-link message template is missing or not approved.',
  copay_message_failed: 'The payment link was created, but the message was not sent. It will retry.',
  csv_columns_missing: 'The CSV is missing a required column.',
  idempotency_key_invalid: 'Could not start this co-pay request. Try again.',
};

export function maskConnectedAccount(accountId) {
  if (!accountId) {
    return 'Not connected';
  }
  const value = String(accountId);
  if (value.length <= 8) {
    return value;
  }
  return `${value.slice(0, 5)}…${value.slice(-4)}`;
}

const ROW_ERRORS = {
  external_identification_number_invalid: 'External identification number is not valid.',
  appointment_invalid: 'Appointment id is not valid.',
  amount_invalid: 'Amount must be at least 0.50.',
  duplicate_row: 'This patient and appointment are already in the file.',
  patient_not_found: 'No patient in this clinic has that external identification number.',
  appointment_required: 'More than one upcoming visit. Add the appointment id.',
  appointment_not_found: 'That appointment was not found for this patient.',
  stripe_account_not_ready: 'Stripe is not ready for payment links.',
  copay_template_missing: 'The payment-link template is missing or not approved.',
  copay_message_failed: 'The message was not sent. It will retry.',
  checkout_failed: 'Stripe did not create the payment link.',
};

export function copayRowError(code) {
  if (!code) {
    return '';
  }
  return code
    .split(',')
    .map((part) => ROW_ERRORS[part] || part)
    .join(' ');
}

export function billingErrorMessage(error) {
  const data = error?.response?.data;
  const code = data?.code;
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  const detail = typeof data?.detail === 'string' ? data.detail.trim() : '';
  if (detail && !/sk_|rk_|whsec_/.test(detail)) {
    return detail;
  }
  return 'Billing request failed. Try again.';
}
