import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Descriptions,
  Form,
  Input,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { getClinic } from 'redux/actions/Clinic';
import billingService from 'services/BillingService';
import Loading from 'components/shared-components/Loading';
import {
  ONBOARDING_STATUS,
  billingErrorMessage,
  maskConnectedAccount,
} from './billingStatus';

const { Text, Paragraph } = Typography;

const STATUS_COLOR = {
  not_started: 'default',
  pending: 'processing',
  active: 'success',
  restricted: 'error',
};

const yesNo = (value) => (value ? 'Yes' : 'No');

const BillingSettings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const clinic = useSelector(makeSelectClinic());
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState('');
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [form] = Form.useForm();
  const handledStripeReturn = useRef('');

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await billingService.getStatus();
      setStatus(response.data);
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
    return <Loading cover="content" />;
  }

  const onboarding = status?.onboarding_status || 'not_started';
  const provider = (PASProvider || '').trim();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Billing
        </Typography.Title>
        <Text type="secondary">
          {clinic?.name || 'This clinic'}
          {provider ? ` · ${provider}` : ''}
        </Text>
      </div>

      {status?.sandbox && (
        <Alert
          type="info"
          showIcon
          message="Sandbox mode is on. Stripe and Metronome calls stay in test."
        />
      )}

      {error && (
        <Alert
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

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Stripe status">
          <Tag color={STATUS_COLOR[onboarding] || 'default'}>
            {ONBOARDING_STATUS[onboarding] || onboarding}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Connected account">
          {maskConnectedAccount(status?.stripe_connected_account_id)}
        </Descriptions.Item>
        <Descriptions.Item label="Charges enabled">
          {yesNo(status?.charges_enabled)}
        </Descriptions.Item>
        <Descriptions.Item label="Payouts enabled">
          {yesNo(status?.payouts_enabled)}
        </Descriptions.Item>
        <Descriptions.Item label="Copay links">
          {status?.payment_links_enabled ? 'Ready' : 'Not ready'}
        </Descriptions.Item>
        <Descriptions.Item label="Copay fee">
          0.5% of the amount, with a $0.50 minimum. This is set by Spryt.
        </Descriptions.Item>
      </Descriptions>

      {status?.disabled_reason && (
        <Alert
          type="warning"
          showIcon
          message="Stripe restricted this account"
          description={status.disabled_reason}
        />
      )}

      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Connect a new Stripe account, or attach one this clinic already uses.
        Payment links stay off until Stripe reports charges as enabled.
      </Paragraph>

      <Space wrap>
        <Button
          type="primary"
          loading={acting === 'onboard'}
          disabled={Boolean(acting) && acting !== 'onboard'}
          onClick={startOnboarding}
        >
          Start Stripe Connect onboarding
        </Button>
        {onboardingUrl && (
          <Button href={onboardingUrl} target="_blank" rel="noopener noreferrer">
            Open Stripe onboarding
          </Button>
        )}
        <Button
          loading={acting === 'dashboard'}
          disabled={!status?.stripe_connected_account_id || (Boolean(acting) && acting !== 'dashboard')}
          onClick={openDashboard}
        >
          Open Stripe dashboard
        </Button>
        <Button
          loading={acting === 'refresh'}
          disabled={!status?.stripe_connected_account_id || (Boolean(acting) && acting !== 'refresh')}
          onClick={refresh}
        >
          Refresh status
        </Button>
      </Space>

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
    </Space>
  );
};

export default BillingSettings;
