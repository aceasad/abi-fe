import { useState } from 'react';
import { Alert, Button, Space, Table, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import billingService from 'services/BillingService';
import { billingErrorMessage, copayRowError } from './billingStatus';

const { Text, Paragraph } = Typography;

const REQUEST_STATUS = {
  queued: 'Queued',
  processing: 'Sending',
  completed: 'Sent',
  failed: 'Failed',
  partial: 'Partly sent',
  blocked: 'Stripe is not ready',
};

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

export function parseCopayCsv(text) {
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (!lines.length) {
    return { error: 'The file is empty.', rows: [] };
  }
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  const missing = ['external_identification_number', 'amount'].filter(
    (column) => !headers.includes(column)
  );
  if (missing.length) {
    return { error: `Add these columns: ${missing.join(', ')}.`, rows: [] };
  }
  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const raw = {};
    headers.forEach((header, index) => {
      raw[header] = (cells[index] || '').trim();
    });
    const row = {
      external_identification_number: raw.external_identification_number || '',
      amount: raw.amount || '',
    };
    if (raw.appointment) {
      row.appointment = raw.appointment;
    }
    return row;
  }).filter((row) => row.external_identification_number || row.amount);
  if (!rows.length) {
    return { error: 'The file has a header and no patients.', rows: [] };
  }
  return { rows };
}

function downloadTemplate() {
  const csv = 'external_identification_number,amount,appointment\n1419863,40.00,\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'copay-request-template.csv';
  link.click();
  URL.revokeObjectURL(url);
}

const CopayRequestUpload = ({ paymentLinksEnabled }) => {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [acting, setActing] = useState('');

  const reset = () => {
    setRows([]);
    setFileName('');
    setPreview(null);
    setResult(null);
    setError('');
  };

  const readFile = (file) => {
    reset();
    const reader = new FileReader();
    reader.onload = async () => {
      const parsed = parseCopayCsv(reader.result);
      if (parsed.error) {
        setError(parsed.error);
        return;
      }
      setRows(parsed.rows);
      setFileName(file.name);
      setActing('validate');
      try {
        const response = await billingService.validateCopayRequest(parsed.rows);
        setPreview(response.data);
      } catch (err) {
        setError(billingErrorMessage(err));
      } finally {
        setActing('');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const submit = async () => {
    setActing('submit');
    setError('');
    try {
      const response = await billingService.createCopayRequest(
        rows,
        `csv-${Date.now()}`,
        fileName
      );
      setResult(response.data);
      const requestStatus = response.data?.status;
      if (requestStatus === 'blocked') {
        message.warning('Stripe is not ready, so nothing was sent.');
      } else if (requestStatus === 'completed') {
        message.success('Co-pay requests sent.');
      } else if (requestStatus === 'partial') {
        message.warning('Some co-pay requests were sent. The rest need a fix.');
      } else {
        message.success('Co-pay request is sending.');
      }
    } catch (err) {
      setError(billingErrorMessage(err));
    } finally {
      setActing('');
    }
  };

  const previewRows = [
    ...(preview?.valid || []).map((row) => ({ ...row, ok: true })),
    ...(preview?.invalid || []).map((row) => ({ ...row, ok: false })),
  ].sort((left, right) => left.row_number - right.row_number);

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={5} style={{ marginBottom: 4 }}>
          Co-pay requests
        </Typography.Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Upload a CSV with the patient&apos;s external identification number and the co-pay amount.
          Add the appointment id only when that patient has more than one upcoming visit.
          Each patient gets the payment-link message with a Stripe link.
        </Paragraph>
      </div>

      {!paymentLinksEnabled && (
        <Alert
          type="warning"
          showIcon
          message="Connect Stripe and finish onboarding before a co-pay request can be sent."
        />
      )}

      <Space wrap>
        <Button onClick={downloadTemplate}>Download template</Button>
        <Upload accept=".csv,text/csv" showUploadList={false} beforeUpload={readFile}>
          <Button icon={<UploadOutlined />} loading={acting === 'validate'}>
            Choose CSV
          </Button>
        </Upload>
        {fileName && <Text type="secondary">{fileName}</Text>}
      </Space>

      {error && <Alert type="error" showIcon message={error} />}

      {preview && (
        <>
          <Text>
            {preview.valid?.length || 0} ready, {preview.invalid?.length || 0} need a fix.
          </Text>
          <Table
            size="small"
            pagination={false}
            rowKey="row_number"
            dataSource={previewRows}
            columns={[
              { title: 'Row', dataIndex: 'row_number', width: 70 },
              { title: 'Patient', dataIndex: 'patient_ref' },
              {
                title: 'Amount',
                dataIndex: 'amount_cents',
                render: (cents) => (cents == null ? '' : `$${(cents / 100).toFixed(2)}`),
              },
              { title: 'Appointment', dataIndex: 'appointment_ref' },
              {
                title: 'Result',
                render: (_, row) => (row.ok ? 'Ready' : copayRowError((row.errors || []).join(','))),
              },
            ]}
          />
          <Button
            type="primary"
            disabled={!preview.valid?.length || !paymentLinksEnabled}
            loading={acting === 'submit'}
            onClick={submit}
          >
            Send co-pay requests
          </Button>
        </>
      )}

      {result && (
        <Alert
          type={result.status === 'blocked' || result.status === 'failed' ? 'warning' : 'success'}
          showIcon
          message={REQUEST_STATUS[result.status] || result.status}
          description={(result.rows || [])
            .filter((row) => row.error)
            .map((row) => `Row ${row.row_number}: ${copayRowError(row.error)}`)
            .join(' ')}
        />
      )}
    </Space>
  );
};

export default CopayRequestUpload;
