import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, InputNumber, Row, Spin, Table, Typography } from 'antd';
import billingService from 'services/BillingService';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import dayjs from 'utils/dayjs';
import { billingErrorMessage } from '../SettingsPage/billingStatus';

const { Text } = Typography;

const dollars = (cents) => {
  if (cents === null || cents === undefined || cents === '') {
    return '—';
  }
  return `$${((Number(cents) || 0) / 100).toFixed(2)}`;
};

const meterLabel = {
  managed_appointment: 'Managed appointments',
  recovered_appointment: 'Recovered appointments',
  coverage_verification: 'Coverage verification',
  insurance_discovery: 'Insurance discovery',
  clean_preauth: 'Clean preauth',
  passthrough_messaging: 'Messaging',
  passthrough_insurance: 'Insurance pass-through',
  transport_completed: 'Transport completed',
  transport_trip_cost: 'Transport trip cost',
  implementation_fee: 'Implementation fee',
  copay_collected: 'Copay collected',
};

const currentMonth = () => {
  const today = dayjs();
  return {
    start: today.startOf('month').format('YYYY-MM-DD'),
    end: today.format('YYYY-MM-DD'),
  };
};

const forecastCents = (spend) => {
  const today = dayjs();
  const daysInMonth = today.daysInMonth();
  const elapsed = Math.max(1, today.date());
  return Math.round((Number(spend) || 0) / elapsed * daysInMonth);
};

const WeeklyBars = ({ points }) => {
  const max = Math.max(1, ...(points || []).map((point) => point.quantity || 0));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28 }}>
      {(points || []).map((point) => (
        <div
          key={point.date}
          title={`${point.date}: ${point.quantity}`}
          style={{
            width: 8,
            height: `${Math.max(2, ((point.quantity || 0) / max) * 28)}px`,
            background: '#5d4ebf',
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

const UsageDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventTotal, setEventTotal] = useState(0);
  const [eventPage, setEventPage] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState(null);
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  useEffect(() => {
    const { start, end } = currentMonth();
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      billingService.getUsage(start, end, 'week'),
      billingService.getLedger({ limit: DEFAULT_SMALL_PAGINATION_LIMIT, offset: 0 }),
      billingService.getInvoices(),
      billingService.getStatus(),
    ])
      .then(([usage, ledger, invoiceResponse, statusResponse]) => {
        if (cancelled) {
          return;
        }
        const rows = ledger.data?.events || [];
        setMetrics(usage.data?.metrics || []);
        setEvents(rows);
        setEventTotal(Number.isInteger(ledger.data?.count) ? ledger.data.count : rows.length);
        setInvoices(invoiceResponse.data?.invoices || []);
        setStatus(statusResponse.data || null);
        const cents = statusResponse.data?.monthly_budget_cents;
        setBudget(cents == null ? null : cents / 100);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(billingErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveBudget = async () => {
    setSavingBudget(true);
    try {
      const cents = budget == null || budget === '' ? null : Math.round(Number(budget) * 100);
      const response = await billingService.saveSettings({ monthly_budget_cents: cents });
      setStatus(response.data);
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setSavingBudget(false);
    }
  };

  const changeEventPage = (next) => {
    setEventPage(next);
    billingService.getLedger({
      limit: DEFAULT_SMALL_PAGINATION_LIMIT,
      offset: (next - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
    })
      .then((ledger) => {
        const rows = ledger.data?.events || [];
        setEvents(rows);
        setEventTotal(Number.isInteger(ledger.data?.count) ? ledger.data.count : rows.length);
      })
      .catch((err) => {
        setError(billingErrorMessage(err));
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <Spin />
      </div>
    );
  }
  if (error && !metrics.length && !events.length) {
    return <Alert type="error" showIcon message={error} />;
  }

  const openBill = invoices.find((invoice) => invoice.current) || invoices[0];
  const previous = invoices.find((invoice) => !invoice.current);
  const spend = openBill?.total_cents || 0;
  const forecast = forecastCents(spend);
  const budgetCents = status?.monthly_budget_cents;
  const used = budgetCents ? Math.round((spend / budgetCents) * 100) : null;
  const rates = {};
  (openBill?.lines || []).forEach((line) => {
    rates[String(line.name || '').toLowerCase()] = line;
  });
  const rows = metrics.map((metric) => {
    const line = rates[(meterLabel[metric.key] || metric.name || '').toLowerCase()];
    const rate = line?.unit_price_cents;
    const quantity = metric.total || 0;
    return {
      ...metric,
      rate,
      cost: rate == null ? line?.total_cents : quantity * rate,
    };
  });
  const active = rows.filter((row) => row.total > 0);
  const idle = rows.filter((row) => !row.total);

  return (
    <>
      {error && <Alert style={{ marginBottom: 12 }} type="error" showIcon message={error} />}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card size="small" title="Spend this month">
            <Text strong>{dollars(spend)}</Text>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card size="small" title="Forecast">
            <Text strong>{dollars(forecast)}</Text>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card size="small" title="Budget">
            {budgetCents ? (
              <Text strong>{`${dollars(budgetCents)} · ${used}% used`}</Text>
            ) : (
              <Text type="secondary">None is set</Text>
            )}
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <InputNumber
                min={0}
                value={budget}
                placeholder="Monthly budget"
                onChange={setBudget}
                style={{ width: '100%' }}
              />
              <Button size="small" loading={savingBudget} onClick={saveBudget}>
                Save
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card size="small" title="Last invoice">
            <Text strong>{previous ? dollars(previous.total_cents) : '—'}</Text>
          </Card>
        </Col>
      </Row>
      <Table
        style={{ marginTop: 16 }}
        size="small"
        pagination={false}
        rowKey="key"
        dataSource={showEmpty ? rows : active}
        columns={[
          { title: 'Meter', dataIndex: 'name' },
          { title: 'Quantity', dataIndex: 'total' },
          { title: 'Rate', dataIndex: 'rate', render: (value) => dollars(value) },
          { title: 'Cost', dataIndex: 'cost', render: (value) => dollars(value) },
          { title: 'Week', dataIndex: 'points', render: (points) => <WeeklyBars points={points} /> },
        ]}
      />
      {idle.length > 0 && (
        <Button type="link" style={{ paddingLeft: 0 }} onClick={() => setShowEmpty((open) => !open)}>
          {showEmpty ? 'Hide meters with no usage' : `${idle.length} meters with no usage this month`}
        </Button>
      )}
      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Live events
      </Typography.Title>
      <Table
        size="small"
        rowKey="transaction_id"
        dataSource={events}
        pagination={{
          current: eventPage,
          pageSize: DEFAULT_SMALL_PAGINATION_LIMIT,
          total: eventTotal,
          hideOnSinglePage: true,
          showSizeChanger: false,
          onChange: changeEventPage,
        }}
        columns={[
          {
            title: 'Time',
            dataIndex: 'event_timestamp',
            render: (value) => (value ? dayjs(value).format('MMM D, h:mm A') : '—'),
          },
          { title: 'Meter', dataIndex: 'event_type', render: (value) => meterLabel[value] || value },
          { title: 'Patient', dataIndex: 'patient_name', render: (value) => value || '—' },
          {
            title: 'Amount',
            dataIndex: 'fee_cents',
            render: (value, row) => dollars(value ?? row.amount_cents),
          },
          {
            title: 'Status',
            dataIndex: 'ingest_status',
            render: (value) => (value === 'skipped' ? 'Skipped' : 'Recorded'),
          },
        ]}
      />
    </>
  );
};

export default UsageDashboard;
