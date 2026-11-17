import { useState } from 'react';
import { Button, Form, Grid, InputNumber, Modal, Select, Tag, message } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientOverview } from 'redux/actions/Patient';
import { makeSelectScheduledAppointments } from 'redux/selectors/Patient';
import billingService from 'services/BillingService';
import utils from 'utils';
import { billingErrorMessage, copayRowError } from '../SettingsPage/billingStatus';

const { useBreakpoint } = Grid;

const COPAY_LABEL = {
  requested: 'Copay requested',
  paid: 'Copay paid',
};

const appointmentLabel = (appointment) => {
  const typeName = appointment?.appointment_type?.name || 'Appointment';
  return `${appointment.date || ''} ${appointment.time || ''} · ${typeName}`.trim();
};

const SendCopayRequest = ({ patient }) => {
  const dispatch = useDispatch();
  const { items, count, loading } = useSelector(makeSelectScheduledAppointments());
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form] = Form.useForm();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const upcoming = (items || []).filter((item) => item?.patient?.id === patient?.id);
  const upcomingCount = count || upcoming.length;
  if (!patient?.id || loading || upcomingCount < 1) {
    return patient?.copay_status ? <Tag>{COPAY_LABEL[patient.copay_status] || patient.copay_status}</Tag> : null;
  }

  const externalId = patient.ExternalIdentificationNumber;
  const single = upcomingCount === 1 ? upcoming[0] : null;

  const submit = async (values) => {
    if (!externalId) {
      message.error('This patient has no external identification number.');
      return;
    }
    const appointment = single || upcoming.find((item) => item.id === values.appointmentId);
    if (upcomingCount > 1 && !appointment) {
      message.error('Choose the upcoming appointment.');
      return;
    }
    setSending(true);
    try {
      const row = {
        external_identification_number: externalId,
        amount: Number(values.amount).toFixed(2),
      };
      if (appointment?.id) {
        row.appointment = String(appointment.id);
      }
      const response = await billingService.createCopayRequest(
        [row],
        `p${patient.id}-${Date.now()}`
      );
      const created = response.data;
      const rowResult = created?.rows?.[0];
      if (created?.status === 'blocked') {
        message.warning('Connect Stripe on the Billing page before sending a co-pay request.');
      } else if (rowResult?.error) {
        message.error(copayRowError(rowResult.error));
      } else {
        const sent = rowResult?.status === 'sent' || created?.status === 'sent';
        message.success(sent ? 'Co-pay request sent.' : 'Co-pay request is sending.');
        setOpen(false);
        form.resetFields();
        dispatch(getPatientOverview({ id: patient.id }));
      }
    } catch (err) {
      message.error(billingErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
      {patient.copay_status && (
        <Tag color={patient.copay_status === 'paid' ? 'success' : 'processing'} style={{ marginRight: 0 }}>
          {COPAY_LABEL[patient.copay_status] || patient.copay_status}
        </Tag>
      )}
      <Button
        type="primary"
        size={isMobile ? 'small' : 'middle'}
        icon={<DollarOutlined />}
        onClick={() => setOpen(true)}
        disabled={!externalId}
        style={{ paddingInline: isMobile ? 12 : 16 }}
      >
        Send co-pay request
      </Button>
      <Modal
        title="Send co-pay request"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={sending}
        okText="Send"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={submit} preserve={false}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: 'Enter the co-pay amount.' },
              {
                validator: (_, value) => (
                  value == null || value >= 0.5
                    ? Promise.resolve()
                    : Promise.reject(new Error('Amount must be at least 0.50.'))
                ),
              },
            ]}
          >
            <InputNumber min={0.5} step={0.5} precision={2} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          {single && (
            <Form.Item label="Appointment">
              <span>{appointmentLabel(single)}</span>
            </Form.Item>
          )}
          {upcomingCount > 1 && (
            <Form.Item
              label="Appointment"
              name="appointmentId"
              extra={
                upcomingCount > upcoming.length
                  ? 'This list is the upcoming visits on the current page.'
                  : undefined
              }
              rules={[{ required: true, message: 'Choose the upcoming appointment.' }]}
            >
              <Select
                options={upcoming.map((item) => ({
                  value: item.id,
                  label: appointmentLabel(item),
                }))}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SendCopayRequest;
