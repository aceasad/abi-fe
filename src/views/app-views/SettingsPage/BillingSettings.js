import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Switch,
  Tag,
  Typography,
  message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { getClinic } from 'redux/actions/Clinic';
import billingService from 'services/BillingService';
import {
  ONBOARDING_STATUS,
  billingErrorMessage,
  maskConnectedAccount,
} from './billingStatus';

const { Text } = Typography;

const LEAD_DAY_OPTIONS = [1, 2, 3, 5, 7, 14].map((days) => ({
  value: days,
  label: `${days} ${days === 1 ? 'day' : 'days'} before the visit`,
}));

const STATUS_COLOR = {
  not_started: 'default',
  pending: 'processing',
  active: 'success',
  restricted: 'error',
};

const enabledLabel = (value) => (value ? 'Enabled' : 'Not enabled');

const BillingSettings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const clinic = useSelector(makeSelectClinic());
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState('');
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [collectCopays, setCollectCopays] = useState(false);
  const [leadDays, setLeadDays] = useState(3);
  const [payAtVisit, setPayAtVisit] = useState(false);
  const [budgetDollars, setBudgetDollars] = useState(null);
  const [changingAccount, setChangingAccount] = useState(false);
  const [form] = Form.useForm();
  const handledStripeReturn = useRef('');

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await billingService.getStatus();
      setStatus(response.data);
      setCollectCopays(Boolean(response.data?.collect_copays));
      setLeadDays(response.data?.copay_lead_days ?? 3);
      setPayAtVisit(Boolean(response.data?.offer_pay_at_visit));
      const cents = response.data?.monthly_budget_cents;
      setBudgetDollars(cents == null ? null : cents / 100);
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!clinic) {
      dispatch(getClinic());
    }
  }, [clinic, dispatch]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const runAction = async (name, action, successText) => {
    setActing(name);
    setError('');
    try {
      const response = await action();
      if (response?.data?.organization_id) {
        const account = { ...response.data };
        delete account.url;
        setStatus(account);
      }
      message.success(successText);
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setActing('');
    }
  };

  const startOnboarding = async ({ replace = false } = {}) => {
    const tab = replace ? null : window.open('', '_blank');
    setActing('onboard');
    setError('');
    try {
      const response = await billingService.startOnboarding();
      const url = response?.data?.url;
      const account = { ...(response?.data || {}) };
      delete account.url;
      if (account.organization_id) {
        setStatus(account);
      }
      if (url) {
        setOnboardingUrl(url);
        if (replace) {
          window.location.assign(url);
          return;
        }
        if (tab) {
          tab.location.href = url;
        }
      } else if (tab) {
        tab.close();
      }
      message.success('Stripe onboarding opened. Finish it, then refresh status.');
    } catch (err) {
      if (tab) {
        tab.close();
      }
      setError(billingErrorMessage(err));
    } finally {
      setActing('');
    }
  };

  const openDashboard = async () => {
    const tab = window.open('', '_blank');
    setActing('dashboard');
    setError('');
    try {
      const response = await billingService.openDashboard();
      const url = response?.data?.url;
      if (url && tab) {
        tab.location.href = url;
      } else if (tab) {
        tab.close();
      }
    } catch (err) {
      if (tab) {
        tab.close();
      }
      setError(billingErrorMessage(err));
    } finally {
      setActing('');
    }
  };

  const refresh = () =>
    runAction(
      'refresh',
      () => billingService.refreshStatus(),
      'Stripe status refreshed.'
    );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connect = params.get('connect');
    const checkout = params.get('checkout');
    if (!connect && !checkout) {
      return;
    }
    if (handledStripeReturn.current === location.search) {
      return;
    }
    handledStripeReturn.current = location.search;
    history.replace(location.pathname);
    if (connect === 'return') {
      refresh();
    } else if (connect === 'refresh') {
      startOnboarding({ replace: true });
    } else if (checkout === 'success') {
      message.success('Payment finished.');
    } else if (checkout === 'cancel') {
      message.info('Payment was cancelled.');
    }
  }, [history, location.pathname, location.search]);

  const persistCollection = async (next) => {
    const payload = {
      collect_copays: collectCopays,
      copay_lead_days: leadDays,
      offer_pay_at_visit: payAtVisit,
      ...next,
    };
    setCollectCopays(payload.collect_copays);
    setLeadDays(payload.copay_lead_days);
    setPayAtVisit(payload.offer_pay_at_visit);
    setActing('collection');
    setError('');
    try {
      const response = await billingService.saveSettings(payload);
      if (response?.data?.organization_id) {
        setStatus(response.data);
      }
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setActing('');
    }
  };

  const saveBudget = async (value) => {
    const cents = value == null || value === '' ? null : Math.round(Number(value) * 100);
    setBudgetDollars(value == null || value === '' ? null : Number(value));
    setActing('budget');
    setError('');
    try {
      const response = await billingService.saveSettings({ monthly_budget_cents: cents });
      if (response?.data?.organization_id) {
        setStatus(response.data);
        const saved = response.data.monthly_budget_cents;
        setBudgetDollars(saved == null ? null : saved / 100);
      }
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setActing('');
    }
  };

  const attach = async (values) => {
    const stripeAccountId = (values.stripe_account_id || '').trim();
    await runAction(
      'attach',
      () => billingService.attachAccount(stripeAccountId),
      'Stripe account attached.'
    );
    form.resetFields();
  };

  if (loading && !status) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <Spin />
      </div>
    );
  }

  const onboarding = status?.onboarding_status || 'not_started';
  const connected = Boolean(status?.stripe_connected_account_id);
  const leadOptions = LEAD_DAY_OPTIONS.some((option) => option.value === leadDays)
    ? LEAD_DAY_OPTIONS
    : [{ value: leadDays, label: `${leadDays} days before the visit` }, ...LEAD_DAY_OPTIONS];
  const darkButton = { background: '#17382c', borderColor: '#17382c' };

  return (
    <div>
      {status?.sandbox && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16, background: '#f8edd4', borderColor: '#f3e2b4' }}
          message={`${clinic?.name || 'This clinic'} is in sandbox mode. Stripe and Metronome calls stay in test. No real money moves.`}
        />
      )}

      {error && (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" onClick={loadStatus}>
              Try again
            </Button>
          }
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            style={{ height: '100%' }}
            title="Stripe account"
            extra={(
              <Tag color={STATUS_COLOR[onboarding] || 'default'}>
                {ONBOARDING_STATUS[onboarding] || onboarding}
              </Tag>
            )}
          >
            <DetailRow label="Connected account" value={maskConnectedAccount(status?.stripe_connected_account_id)} />
            <DetailRow label="Charges" value={enabledLabel(status?.charges_enabled)} />
            <DetailRow label="Payouts" value={enabledLabel(status?.payouts_enabled)} />
            <DetailRow label="Copay links" value={status?.payment_links_enabled ? 'Ready' : 'Not ready'} />

            {status?.disabled_reason && (
              <Alert
                style={{ marginTop: 16 }}
                type="warning"
                showIcon
                message="Stripe restricted this account"
                description={status.disabled_reason}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
              {!connected && (
                <Button
                  type="primary"
                  shape="round"
                  style={darkButton}
                  loading={acting === 'onboard'}
                  disabled={Boolean(acting) && acting !== 'onboard'}
                  onClick={startOnboarding}
                >
                  Start Stripe Connect onboarding
                </Button>
              )}
              {connected && (
                <Button
                  type="primary"
                  shape="round"
                  style={darkButton}
                  loading={acting === 'dashboard'}
                  disabled={Boolean(acting) && acting !== 'dashboard'}
                  onClick={openDashboard}
                >
                  Open Stripe dashboard
                </Button>
              )}
              {connected && (
                <Button
                  shape="round"
                  loading={acting === 'refresh'}
                  disabled={Boolean(acting) && acting !== 'refresh'}
                  onClick={refresh}
                >
                  Refresh status
                </Button>
              )}
              <Button type="link" onClick={() => setChangingAccount((open) => !open)}>
                Change Stripe account
              </Button>
            </div>
            {onboardingUrl && (
              <Button href={onboardingUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                Open Stripe onboarding
              </Button>
            )}
            {changingAccount && (
              <div style={{ marginTop: 16 }}>
                {connected && (
                  <Button
                    style={{ marginBottom: 12 }}
                    loading={acting === 'onboard'}
                    disabled={Boolean(acting) && acting !== 'onboard'}
                    onClick={startOnboarding}
                  >
                    Start Stripe Connect onboarding
                  </Button>
                )}
                <Form form={form} layout="vertical" onFinish={attach} style={{ maxWidth: 420 }}>
                  <Form.Item
                    label="Existing Stripe account"
                    name="stripe_account_id"
                    rules={[
                      { required: true, message: 'Enter the Stripe account id.' },
                      {
                        pattern: /^acct_[A-Za-z0-9]+$/,
                        message: 'Use an account id that starts with acct_.',
                      },
                    ]}
                  >
                    <Input placeholder="acct_..." autoComplete="off" />
                  </Form.Item>
                  <Button htmlType="submit" loading={acting === 'attach'} disabled={Boolean(acting) && acting !== 'attach'}>
                    Connect existing Stripe account
                  </Button>
                </Form>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }} title="Copay collection">
            <SettingRow
              title="Collect copays through Asa"
              detail="Asa tells the patient the amount and sends a secure payment link."
              control={(
                <Switch
                  className="billing-collection-switch"
                  checked={collectCopays}
                  loading={acting === 'collection'}
                  onChange={(checked) => persistCollection({ collect_copays: checked })}
                />
              )}
            />
            <SettingRow
              title="When Asa asks"
              detail="Once coverage is verified."
              control={(
                <Select
                  value={leadDays}
                  options={leadOptions}
                  style={{ minWidth: 200 }}
                  disabled={acting === 'collection'}
                  onChange={(value) => persistCollection({ copay_lead_days: value })}
                />
              )}
            />
            <SettingRow
              title='Offer "Pay at the visit"'
              detail="Patients can choose to pay at the front desk."
              control={(
                <Switch
                  className="billing-collection-switch"
                  checked={payAtVisit}
                  loading={acting === 'collection'}
                  onChange={(checked) => persistCollection({ offer_pay_at_visit: checked })}
                />
              )}
            />
            <SettingRow
              title="Copay fee"
              detail="0.5% of the amount, with a $0.50 minimum. Set by Spryt. A $40 copay costs $0.50."
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }} title="Monthly budget">
        <SettingRow
          title="Spend limit for the month"
          detail="Shown on Usage as a bar against this month's spend."
          control={(
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <InputNumber
                min={0}
                prefix="$"
                value={budgetDollars}
                placeholder="None"
                style={{ width: 160 }}
                disabled={acting === 'budget'}
                onChange={setBudgetDollars}
                onPressEnter={() => saveBudget(budgetDollars)}
              />
              <Button
                type="primary"
                loading={acting === 'budget'}
                disabled={Boolean(acting) && acting !== 'budget'}
                onClick={() => saveBudget(budgetDollars)}
              >
                Save
              </Button>
            </div>
          )}
        />
      </Card>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
    <Text type="secondary">{label}</Text>
    <Text>{value}</Text>
  </div>
);

const SettingRow = ({ title, detail, control }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
    <div>
      <div>{title}</div>
      <Text type="secondary">{detail}</Text>
    </div>
    {control ? <div style={{ flex: '0 0 auto' }}>{control}</div> : null}
  </div>
);

export default BillingSettings;
