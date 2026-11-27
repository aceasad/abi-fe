import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spin, Table, Typography } from 'antd';
import billingService from 'services/BillingService';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import dayjs from 'utils/dayjs';
import { billingErrorMessage } from '../SettingsPage/billingStatus';

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

const SummaryCard = ({ label, value, detail, children }) => (
  <Card size="small" styles={{ body: { minHeight: 132 } }}>
    <div style={{ fontSize: 13, fontWeight: 400, color: '#72849a' }}>{label}</div>
    <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, color: '#1a3353', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
      {value}
    </div>
    {children}
    {detail ? (
      <div style={{ marginTop: 8, fontSize: 12, color: '#8c9bab' }}>{detail}</div>
    ) : null}
  </Card>
);

const UsageDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventTotal, setEventTotal] = useState(0);
  const [eventPage, setEventPage] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);

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

  const today = dayjs();
  const openBill = invoices.find((invoice) => invoice.current) || invoices[0];
  const previous = invoices.find((invoice) => !invoice.current);
  const spend = openBill?.total_cents || 0;
  const forecast = forecastCents(spend);
  const budgetCents = status?.monthly_budget_cents;
  const used = budgetCents ? Math.round((spend / budgetCents) * 100) : null;
  const barWidth = used == null ? 0 : Math.min(100, Math.max(0, used));
  const rows = metrics.map((metric) => ({
    ...metric,
    rate: metric.rate_cents,
    cost: metric.cost_cents,
  }));
  const active = rows.filter((row) => row.total > 0);
  const idle = rows.filter((row) => !row.total);

  return (
    <>
      {error && <Alert style={{ marginBottom: 12 }} type="error" showIcon message={error} />}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <SummaryCard
            label="Spend this month"
            value={dollars(spend)}
            detail={`${today.startOf('month').format('MMM D')} to today`}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <SummaryCard
            label={`Forecast for ${today.format('MMMM')}`}
            value={dollars(forecast)}
            detail="At the current pace"
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <SummaryCard
            label="Budget"
            value={budgetCents ? dollars(budgetCents) : 'None is set'}
            detail={budgetCents ? `${used}% used` : 'Set a monthly budget in Payment setup'}
          >
            {budgetCents ? (
              <div style={{ marginTop: 12, height: 6, borderRadius: 99, background: '#e7eaef', overflow: 'hidden' }}>
                <div style={{ width: `${barWidth}%`, height: '100%', background: '#2ec4d6' }} />
              </div>
            ) : null}
          </SummaryCard>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <SummaryCard
            label="Last invoice"
            value={previous ? dollars(previous.total_cents) : 'None yet'}
            detail={previous ? 'Previous bill' : `First bill closes ${today.endOf('month').format('MMM D')}`}
          />
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
          {
            title: 'Rate',
            dataIndex: 'rate',
            render: (value, row) => (value == null ? (row.rate_label || '—') : dollars(value)),
          },
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
