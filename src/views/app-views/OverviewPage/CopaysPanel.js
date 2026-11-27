import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spin, Table, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import billingService from 'services/BillingService';
import dayjs from 'utils/dayjs';
import { billingErrorMessage } from '../SettingsPage/billingStatus';

const { Text } = Typography;

const dollars = (cents) => `$${((Number(cents) || 0) / 100).toFixed(2)}`;

const STATUS_STYLE = {
  Paid: { background: '#e5f6ec', color: '#1d7a45' },
  'Link sent': { background: '#e7f0fb', color: '#2f6fad' },
  Failed: { background: '#fde8e6', color: '#c2413b' },
};

const countPhrase = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

const shortReference = (value) => {
  if (!value) {
    return 'No payment yet';
  }
  if (value.length <= 18) {
    return value;
  }
  return `${value.slice(0, 10)}…${value.slice(-4)}`;
};

const appointmentLabel = (row) => {
  if (!row.appointment_start) {
    return row.appointment || '—';
  }
  const date = dayjs(row.appointment_start).format('MMM D');
  return row.appointment_type ? `${date} · ${row.appointment_type}` : date;
};

const CopaysPanel = () => {
  const [month, setMonth] = useState(() => dayjs().startOf('month'));
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [opening, setOpening] = useState(false);
  const isCurrentMonth = month.isSame(dayjs(), 'month');
  const periodStart = month.startOf('month').format('YYYY-MM-DD');
  const periodEnd = (isCurrentMonth ? dayjs() : month.endOf('month')).format('YYYY-MM-DD');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await billingService.getCopays(periodStart, periodEnd);
      setReport(response.data);
    } catch (err) {
      setError(billingErrorMessage(err));
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [periodStart, periodEnd]);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const response = await billingService.exportCopays(periodStart, periodEnd);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `copays-${month.format('YYYY-MM')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const openStripe = async () => {
    const tab = window.open('', '_blank');
    setOpening(true);
    try {
      const response = await billingService.openDashboard();
      if (response.data?.url && tab) {
        tab.location.href = response.data.url;
      } else if (tab) {
        tab.close();
      }
    } catch (err) {
      if (tab) {
        tab.close();
      }
      setError(billingErrorMessage(err));
    } finally {
      setOpening(false);
    }
  };

  const rows = report?.rows || [];
  const paidCount = rows.filter((row) => row.status === 'Paid').length;
  const openCount = rows.filter((row) => row.status === 'Link sent' || row.status === 'Failed').length;
  const cards = [
    [
      isCurrentMonth ? 'Collected this month' : `Collected in ${month.format('MMMM')}`,
      report?.collected_cents,
      countPhrase(paidCount, 'copay paid by link', 'copays paid by link'),
    ],
    ['Net to clinic', report?.net_cents, 'After the Spryt fee. This amount does not include the Stripe fee.'],
    ['Outstanding', report?.outstanding_cents, countPhrase(openCount, 'copay requested, not paid', 'copays requested, not paid')],
  ];

  return (
    <>
      {error && <Alert style={{ marginBottom: 12 }} type="error" showIcon message={error} />}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid #ececec',
            borderRadius: 999,
            padding: '2px 4px',
            color: '#595959',
            background: '#fff',
          }}
        >
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<LeftOutlined />}
            aria-label="Previous month"
            onClick={() => setMonth((value) => value.subtract(1, 'month'))}
          />
          {`Period: ${month.format('MMMM YYYY')}`}
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<RightOutlined />}
            aria-label="Next month"
            disabled={isCurrentMonth}
            onClick={() => setMonth((value) => value.add(1, 'month'))}
          />
        </span>
        <Button shape="round" loading={exporting} onClick={exportCsv}>Export CSV</Button>
        <Button shape="round" loading={opening} onClick={openStripe}>Open Stripe dashboard</Button>
      </div>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <Spin />
        </div>
      )}
      {!loading && error && !report && <Alert type="error" showIcon message={error} />}
      {!loading && report && (
      <>
      <Row gutter={[16, 16]}>
        {cards.map(([title, cents, detail]) => (
          <Col key={title} xs={24} md={12} xl={8}>
            <Card>
              <Text type="secondary">{title}</Text>
              <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, margin: '4px 0' }}>
                {dollars(cents)}
              </div>
              <Text type="secondary">{detail}</Text>
            </Card>
          </Col>
        ))}
      </Row>
      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Copay payments
      </Typography.Title>
      <Table
        size="middle"
        pagination={false}
        rowKey="id"
        dataSource={rows}
        columns={[
          {
            title: 'Date',
            dataIndex: 'date',
            render: (value) => (value ? dayjs(value).format('MMM D') : '—'),
          },
          { title: 'Patient', dataIndex: 'patient' },
          { title: 'Appointment', render: (_, row) => appointmentLabel(row) },
          { title: 'Amount', dataIndex: 'amount_cents', render: dollars },
          {
            title: 'Fee',
            dataIndex: 'fee_cents',
            render: (value, row) => (row.status === 'Paid' ? dollars(value) : 'Not charged'),
          },
          {
            title: 'Net',
            dataIndex: 'net_cents',
            render: (value, row) => (row.status === 'Paid' ? dollars(value) : dollars(0)),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (value) => (
              <span
                style={{
                  ...(STATUS_STYLE[value] || { background: '#f0f0f0', color: '#595959' }),
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 13,
                }}
              >
                {value}
              </span>
            ),
          },
          {
            title: 'Stripe reference',
            dataIndex: 'stripe_reference',
            render: (value) => shortReference(value),
          },
        ]}
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
        Copays are the clinic’s income from patients. They do not appear on the Spryt bill. Payments marked paid at the desk are not listed here.
      </Text>
      </>
      )}
    </>
  );
};

export default CopaysPanel;
