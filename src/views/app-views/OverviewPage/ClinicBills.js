import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Table, Tag, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
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

const PAYMENT_COLOR = {
  paid: 'success',
  partial: 'warning',
  unpaid: 'default',
  void: 'default',
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
  const date = new Date(start);
  if (Number.isNaN(date.getTime())) {
    return 'Bill';
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

const copayTip = (line) => {
  const collected = Number(line.collected_cents) || 0;
  const collectedText = collected
    ? ` Patients paid ${dollars(collected)} in co-pay this period.`
    : '';
  return `Co-pay is not billed on this invoice. It is shown here as a metric.${collectedText}`;
};

const lineName = (line) => {
  if (!line.informational) {
    return line.name;
  }
  return (
    <span>
      {line.name}{' '}
      <Tooltip title={copayTip(line)}>
        <InfoCircleOutlined />
      </Tooltip>
    </span>
  );
};

const BillTable = ({ invoice, paying, downloading, onPay, onDownload }) => (
  <Table
    style={{ marginTop: 12 }}
    size="small"
    pagination={false}
    rowKey={(row, index) => `${invoice.id}-${row.name}-${index}`}
    dataSource={invoice.lines || []}
    title={() => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span>
          {monthLabel(invoice.start)}{' '}
          <Tag color={PAYMENT_COLOR[invoice.payment] || 'default'}>
            {PAYMENT_LABEL[invoice.payment] || 'Unpaid'}
          </Tag>
        </span>
        {invoice.payable && (
          <Button type="primary" size="small" loading={paying} onClick={() => onPay(invoice)}>
            {`Pay ${dollars(invoice.amount_due_cents)}`}
          </Button>
        )}
        {invoice.payment === 'paid' && (
          <Button size="small" loading={downloading} onClick={() => onDownload(invoice)}>
            Download
          </Button>
        )}
      </span>
    )}
    columns={[
      { title: 'Line', dataIndex: 'name', render: (_, row) => lineName(row) },
      { title: 'Quantity', dataIndex: 'quantity' },
      {
        title: 'Rate',
        dataIndex: 'unit_price_cents',
        render: (value, row) => (row.informational ? '—' : dollars(value)),
      },
      {
        title: 'Amount',
        dataIndex: 'total_cents',
        render: (value, row) => (row.informational ? 'Not billed' : dollars(value)),
      },
    ]}
    summary={() => (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={3}>
          <Text strong>Total</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3}>
          <Text strong>{dollars(invoice.total_cents)}</Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    )}
  />
);

const BillGroup = ({ title, invoices, empty, payingId, downloadingId, onPay, onDownload }) => (
  <div style={{ marginTop: 8 }}>
    <Title level={5} style={{ marginBottom: 0 }}>
      {title}
    </Title>
    {invoices.length === 0 ? (
      <Alert style={{ marginTop: 12 }} type="info" showIcon message={empty} />
    ) : (
      invoices.map((invoice) => (
        <BillTable
          key={invoice.id}
          invoice={invoice}
          paying={payingId === invoice.id}
          downloading={downloadingId === invoice.id}
          onPay={onPay}
          onDownload={onDownload}
        />
      ))
    )}
  </div>
);

const coversRange = (invoice, start, end) => {
  if (!start || !end || !invoice.start) {
    return true;
  }
  const invoiceStart = dayjs(invoice.start);
  const invoiceEnd = invoice.end ? dayjs(invoice.end) : invoiceStart.add(1, 'month');
  return invoiceStart.isBefore(dayjs(end).endOf('day')) && invoiceEnd.isAfter(dayjs(start).startOf('day'));
};

const ClinicBills = ({ start, end }) => {
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

  if (loading) {
    return <Alert type="info" showIcon message="Loading bills…" />;
  }

  if (error) {
    return <Alert type="error" showIcon message={error} />;
  }

  const inRange = invoices.filter((invoice) => coversRange(invoice, start, end));
  const current = inRange.filter((invoice) => invoice.current);
  const previous = inRange.filter((invoice) => !invoice.current);

  return (
    <>
      {payError && <Alert style={{ marginBottom: 12 }} type="error" showIcon message={payError} />}
      <BillGroup
        title="Current bill"
        invoices={current}
        empty="No current bill in this range."
        payingId={payingId}
        downloadingId={downloadingId}
        onPay={pay}
        onDownload={download}
      />
      <BillGroup
        title="Previous bills"
        invoices={previous}
        empty="No previous bills in this range."
        payingId={payingId}
        downloadingId={downloadingId}
        onPay={pay}
        onDownload={download}
      />
    </>
  );
};

export default ClinicBills;
