import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Spin, Table, Typography } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import billingService from 'services/BillingService';
import dayjs from 'utils/dayjs';
import { billingErrorMessage } from '../SettingsPage/billingStatus';

const { Text, Title } = Typography;

const PAYMENT_LABEL = {
  paid: 'Paid',
  partial: 'Partially paid',
  unpaid: 'Unpaid',
  void: 'Void',
};

const PAYMENT_STYLE = {
  paid: { background: '#e5f6ec', color: '#1d7a45' },
  partial: { background: '#f6e4c4', color: '#8a5a16' },
  unpaid: { background: '#f0f0f0', color: '#595959' },
  void: { background: '#f0f0f0', color: '#595959' },
};

const dollars = (cents) => {
  if (cents === null || cents === undefined || cents === '') {
    return '—';
  }
  return `$${((Number(cents) || 0) / 100).toFixed(2)}`;
};

const monthLabel = (start) => {
  if (!start) {
    return 'Bill';
  }
  const date = dayjs.utc(start);
  if (!date.isValid()) {
    return 'Bill';
  }
  return date.format('MMMM YYYY');
};

const periodText = (invoice) => {
  const start = invoice.start ? dayjs.utc(invoice.start) : null;
  if (!start || !start.isValid()) {
    return '';
  }
  let end = invoice.end ? dayjs.utc(invoice.end) : start.endOf('month');
  if (end.hour() === 0 && end.minute() === 0 && end.second() === 0) {
    end = end.subtract(1, 'millisecond');
  }
  return `${start.format('MMM D')} to ${end.format('MMM D')} · closes ${end.format('MMM D')}`;
};

const StatusPill = ({ invoice }) => (
  <span
    style={{
      ...PAYMENT_STYLE[invoice.payment] || PAYMENT_STYLE.unpaid,
      borderRadius: 999,
      padding: '2px 10px',
      fontSize: 13,
      lineHeight: '22px',
    }}
  >
    {PAYMENT_LABEL[invoice.payment] || 'Unpaid'}
  </span>
);

const SummaryRow = ({ label, value, strong, color }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 24,
      padding: '7px 0',
      borderTop: strong && label === 'Total' ? '1px solid #f0f0f0' : undefined,
    }}
  >
    <Text strong={strong}>{label}</Text>
    <Text strong={strong} style={color ? { color } : undefined}>{value}</Text>
  </div>
);

const BillCard = ({ invoice, paying, downloading, onPay, onDownload }) => {
  const [showEmpty, setShowEmpty] = useState(false);
  const lines = invoice.lines || [];
  const charged = lines.filter((line) => Number(line.quantity) > 0);
  const empty = lines.filter((line) => !Number(line.quantity));
  const visible = showEmpty ? lines : charged;
  const paid = Number(invoice.paid_cents) || 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Title level={4} style={{ margin: 0 }}>{monthLabel(invoice.start)}</Title>
            <StatusPill invoice={invoice} />
            {invoice.current && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#e5f6ec',
                  color: '#1d7a45',
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 13,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d7a45' }} />
                Open · updating live
              </span>
            )}
          </div>
          <Text type="secondary">{periodText(invoice)}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button shape="round" loading={downloading} onClick={() => onDownload(invoice)}>
            Download invoice
          </Button>
          {invoice.payable && (
            <Button
              shape="round"
              type="primary"
              loading={paying}
              onClick={() => onPay(invoice)}
              style={{ background: '#17382c', borderColor: '#17382c' }}
            >
              {`Pay ${dollars(invoice.amount_due_cents)}`}
            </Button>
          )}
        </div>
      </div>
      <Table
        style={{ marginTop: 16 }}
        size="middle"
        pagination={false}
        rowKey={(row, index) => `${invoice.id}-${row.name}-${index}`}
        dataSource={visible}
        columns={[
          { title: 'Line', dataIndex: 'name' },
          { title: 'Quantity', dataIndex: 'quantity', align: 'right' },
          {
            title: 'Rate',
            dataIndex: 'unit_price_cents',
            align: 'right',
            render: (value) => (value == null ? '—' : `${dollars(value)} each`),
          },
          { title: 'Amount', dataIndex: 'total_cents', align: 'right', render: (value) => dollars(value) },
        ]}
      />
      {empty.length > 0 && (
        <Button
          type="text"
          style={{ paddingLeft: 0, color: '#8c8c8c' }}
          icon={showEmpty ? <DownOutlined /> : <RightOutlined />}
          onClick={() => setShowEmpty((open) => !open)}
        >
          {showEmpty ? 'Hide lines with no charge' : `Show ${empty.length} lines with no charge`}
        </Button>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <div style={{ width: 280 }}>
          <SummaryRow label="Subtotal" value={dollars(invoice.subtotal_cents)} />
          <SummaryRow label="Taxes" value={dollars(invoice.tax_cents)} />
          <SummaryRow label="Total" value={dollars(invoice.total_cents)} strong />
          <SummaryRow
            label="Paid"
            value={paid ? `-${dollars(paid)}` : dollars(0)}
            color={paid ? '#1d7a45' : undefined}
          />
          <SummaryRow label="Balance due" value={dollars(invoice.amount_due_cents)} strong />
        </div>
      </div>
    </div>
  );
};

const ClinicBills = ({ tabs }) => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState('');
  const [downloadingId, setDownloadingId] = useState('');
  const [payError, setPayError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await billingService.getInvoices();
      setInvoices(response.data?.invoices || []);
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pay = async (invoice) => {
    setPayingId(invoice.id);
    setPayError('');
    try {
      const response = await billingService.payInvoice(invoice.id);
      if (response.data?.url) {
        window.location.assign(response.data.url);
        return;
      }
      await load();
      setPayingId('');
    } catch (err) {
      setPayError(billingErrorMessage(err));
      setPayingId('');
    }
  };

  const download = async (invoice) => {
    setDownloadingId(invoice.id);
    setPayError('');
    try {
      const response = await billingService.downloadInvoice(invoice.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clinic-bill-${(invoice.start || '').slice(0, 7) || invoice.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setPayError(billingErrorMessage(err));
    } finally {
      setDownloadingId('');
    }
  };

  const current = invoices.filter((invoice) => invoice.current);
  const previous = invoices.filter((invoice) => !invoice.current);
  const openBill = current[0];
  const firstMonth = openBill ? monthLabel(openBill.start).split(' ')[0] : '';

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {tabs}
          {openBill && (
            <span
              style={{
                border: '1px solid #ececec',
                borderRadius: 999,
                padding: '6px 12px',
                color: '#595959',
                background: '#fff',
              }}
            >
              {`Bill: ${monthLabel(openBill.start)}`}
            </span>
          )}
        </div>
        {payError && <Alert style={{ marginBottom: 12 }} type="error" showIcon message={payError} />}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spin />
          </div>
        )}
        {!loading && error && <Alert type="error" showIcon message={error} />}
        {!loading && !error && openBill && (
          <BillCard
            invoice={openBill}
            paying={payingId === openBill.id}
            downloading={downloadingId === openBill.id}
            onPay={pay}
            onDownload={download}
          />
        )}
        {!loading && !error && !openBill && <Text type="secondary">No current bill.</Text>}
      </Card>
      {!loading && (
      <Card style={{ marginTop: 16 }}>
        <Title level={5} style={{ marginTop: 0 }}>Previous bills</Title>
        {!loading && !error && previous.length === 0 && (
          <Text type="secondary">
            {firstMonth
              ? `No previous bills yet. ${firstMonth} is this clinic's first billing month.`
              : 'No previous bills.'}
          </Text>
        )}
        {previous.map((invoice) => (
          <div key={invoice.id} style={{ marginTop: 16 }}>
            <BillCard
              invoice={invoice}
              paying={payingId === invoice.id}
              downloading={downloadingId === invoice.id}
              onPay={pay}
              onDownload={download}
            />
          </div>
        ))}
      </Card>
      )}
    </>
  );
};

export default ClinicBills;
