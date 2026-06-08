import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  Typography,
  message,
  Space,
} from 'antd';
import dayjs from 'utils/dayjs';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';
import clinicService from 'services/ClinicService';
import Loading from 'components/shared-components/Loading';
import { useSelector } from 'react-redux';

const { Text } = Typography;
const { Option } = Select;

const CLINIC_TIMEZONES = [
  'Europe/London',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
];

const formatTimeDefault = (hour, minute) => {
  if (hour == null && minute == null) {
    return 'Not set';
  }
  return dayjs()
    .hour(hour ?? 0)
    .minute(minute ?? 0)
    .second(0)
    .format(TIME_FORMAT_HH_MM);
};

const toDayjsFromHourMinute = (hour, minute) => {
  if (hour == null && minute == null) {
    return null;
  }
  return dayjs()
    .hour(hour ?? 0)
    .minute(minute ?? 0)
    .second(0)
    .millisecond(0);
};

const toDayjsFromHour = (hour) => {
  if (hour == null) {
    return null;
  }
  return dayjs().hour(hour).minute(0).second(0).millisecond(0);
};

const FieldLabel = ({ label, defaultValue }) => (
  <span>
    {label}
    <br />
    <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
      System default: {defaultValue}
    </Text>
  </span>
);

const NullableBooleanField = ({ name, label, defaultValue }) => (
  <Form.Item
    label={<FieldLabel label={label} defaultValue={defaultValue ? 'Yes' : 'No'} />}
    name={name}
    normalize={(value) => (value === undefined ? null : value)}
  >
    <Select allowClear placeholder="Use system default">
      <Option value={true}>Yes</Option>
      <Option value={false}>No</Option>
    </Select>
  </Form.Item>
);

const NullableTimeField = ({ name, label, defaultValue, hourOnly = false }) => (
  <Form.Item
    label={<FieldLabel label={label} defaultValue={defaultValue} />}
    name={name}
    getValueFromEvent={(value) => {
      if (!value) {
        return null;
      }
      return hourOnly ? value.minute(0).second(0) : value.second(0);
    }}
  >
    <TimePicker
      allowClear
      format={TIME_FORMAT_HH_MM}
      style={{ width: '100%' }}
      placeholder="Use system default"
      minuteStep={hourOnly ? 60 : 1}
    />
  </Form.Item>
);

const apiToFormValues = (settings) => ({
  disable_csv_upload: settings.disable_csv_upload,
  patient_invite_now: settings.patient_invite_now,
  patient_invite_send_time: toDayjsFromHourMinute(
    settings.patient_invite_send_hour,
    settings.patient_invite_send_minute,
  ),
  appointment_reminder_morning_time: toDayjsFromHour(
    settings.appointment_reminder_morning_hour,
  ),
  appointment_reminder_default_time: toDayjsFromHour(
    settings.appointment_reminder_default_hour,
  ),
  appointment_reminder_midday_time: toDayjsFromHour(
    settings.appointment_reminder_midday_hour,
  ),
  appointment_reminder_afternoon_time: toDayjsFromHour(
    settings.appointment_reminder_afternoon_hour,
  ),
  message_earliest_send_time: toDayjsFromHourMinute(
    settings.message_earliest_send_hour,
    settings.message_earliest_send_minute,
  ),
  timezone: settings.timezone,
  email_for_reports: settings.email_for_reports || '',
  email_for_docman: settings.email_for_docman || '',
});

const formToApiPayload = (values, isEmis) => {
  const inviteTime = values.patient_invite_send_time;
  const earliestTime = values.message_earliest_send_time;

  const payload = {
    disable_csv_upload: values.disable_csv_upload ?? null,
    patient_invite_now: values.patient_invite_now ?? null,
    patient_invite_send_hour: inviteTime ? inviteTime.hour() : null,
    patient_invite_send_minute: inviteTime ? inviteTime.minute() : null,
    appointment_reminder_morning_hour: values.appointment_reminder_morning_time
      ? values.appointment_reminder_morning_time.hour()
      : null,
    appointment_reminder_default_hour: values.appointment_reminder_default_time
      ? values.appointment_reminder_default_time.hour()
      : null,
    appointment_reminder_midday_hour: values.appointment_reminder_midday_time
      ? values.appointment_reminder_midday_time.hour()
      : null,
    appointment_reminder_afternoon_hour: values.appointment_reminder_afternoon_time
      ? values.appointment_reminder_afternoon_time.hour()
      : null,
    message_earliest_send_hour: earliestTime ? earliestTime.hour() : null,
    message_earliest_send_minute: earliestTime ? earliestTime.minute() : null,
    timezone: values.timezone || null,
    email_for_reports: values.email_for_reports?.trim() || null,
  };

  if (isEmis) {
    payload.email_for_docman = values.email_for_docman?.trim() || null;
  }

  return payload;
};

const AdvancedSettings = () => {
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isEmis = PASProvider?.toLowerCase() === 'emis';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaults, setDefaults] = useState({});
  const [extraTimezones, setExtraTimezones] = useState([]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await clinicService.getAdvancedSettings();
      const { system_defaults: systemDefaults, ...settings } = data;
      setDefaults(systemDefaults || {});
      if (settings.timezone && !CLINIC_TIMEZONES.includes(settings.timezone)) {
        setExtraTimezones([settings.timezone]);
      } else {
        setExtraTimezones([]);
      }
      form.setFieldsValue(apiToFormValues(settings));
    } catch {
      message.error('Failed to load advanced settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = formToApiPayload(values, isEmis);
      const { data } = await clinicService.updateAdvancedSettings(payload);
      const { system_defaults: systemDefaults, ...settings } = data;
      setDefaults(systemDefaults || {});
      if (settings.timezone && !CLINIC_TIMEZONES.includes(settings.timezone)) {
        setExtraTimezones([settings.timezone]);
      } else {
        setExtraTimezones([]);
      }
      form.setFieldsValue(apiToFormValues(settings));
      message.success('Advanced settings saved');
    } catch {
      message.error('Failed to save advanced settings');
    } finally {
      setSaving(false);
    }
  };

  const resetAllToDefaults = () => {
    form.setFieldsValue({
      disable_csv_upload: null,
      patient_invite_now: null,
      patient_invite_send_time: null,
      appointment_reminder_morning_time: null,
      appointment_reminder_default_time: null,
      appointment_reminder_midday_time: null,
      appointment_reminder_afternoon_time: null,
      message_earliest_send_time: null,
      timezone: defaults.timezone,
      email_for_reports: '',
      ...(isEmis ? { email_for_docman: '' } : {}),
    });
  };

  if (loading) {
    return <Loading cover="content" />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[24, 0]}>
        <Col xs={24} md={12}>
          <NullableBooleanField
            name="disable_csv_upload"
            label="Disable CSV upload"
            defaultValue={defaults.disable_csv_upload}
          />
        </Col>
        <Col xs={24} md={12}>
          <NullableBooleanField
            name="patient_invite_now"
            label="Send intro immediately"
            defaultValue={defaults.patient_invite_now}
          />
        </Col>

        <Col xs={24} md={12}>
          <NullableTimeField
            name="patient_invite_send_time"
            label="Invite send time"
            defaultValue={formatTimeDefault(
              defaults.patient_invite_send_hour,
              defaults.patient_invite_send_minute,
            )}
          />
        </Col>
        <Col xs={24} md={12}>
          <NullableTimeField
            name="message_earliest_send_time"
            label="Earliest send time"
            defaultValue={formatTimeDefault(
              defaults.message_earliest_send_hour,
              defaults.message_earliest_send_minute,
            )}
          />
        </Col>

        <Col xs={24} md={12}>
          <NullableTimeField
            name="appointment_reminder_morning_time"
            label="Morning reminder time (day-of)"
            defaultValue={formatTimeDefault(defaults.appointment_reminder_morning_hour)}
            hourOnly
          />
        </Col>
        <Col xs={24} md={12}>
          <NullableTimeField
            name="appointment_reminder_default_time"
            label="Offset reminder send time (X days before)"
            defaultValue={formatTimeDefault(defaults.appointment_reminder_default_hour)}
            hourOnly
          />
        </Col>

        <Col xs={24} md={12}>
          <NullableTimeField
            name="appointment_reminder_midday_time"
            label="Midday reminder time"
            defaultValue={formatTimeDefault(defaults.appointment_reminder_midday_hour)}
            hourOnly
          />
        </Col>
        <Col xs={24} md={12}>
          <NullableTimeField
            name="appointment_reminder_afternoon_time"
            label="Afternoon reminder time (day before)"
            defaultValue={formatTimeDefault(defaults.appointment_reminder_afternoon_hour)}
            hourOnly
          />
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={
              <FieldLabel
                label="Clinic timezone"
                defaultValue={defaults.timezone || 'Not set'}
              />
            }
            name="timezone"
          >
            <Select
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              placeholder="Select timezone"
            >
              {[...extraTimezones, ...CLINIC_TIMEZONES].map((tz) => (
                <Option key={tz} value={tz}>
                  {tz}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <FieldLabel
                label="Email for transcripts"
                defaultValue={defaults.email_for_reports || 'Not set'}
              />
            }
            name="email_for_reports"
            normalize={(value) => value ?? ''}
            rules={[{ type: 'email', message: 'Enter a valid email address' }]}
          >
            <Input placeholder="transcripts@clinic.example" allowClear />
          </Form.Item>
        </Col>
        {isEmis && (
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <FieldLabel
                  label="Email for Docman"
                  defaultValue={defaults.email_for_docman || 'Not set'}
                />
              }
              name="email_for_docman"
              normalize={(value) => value ?? ''}
              rules={[{ type: 'email', message: 'Enter a valid email address' }]}
            >
              <Input placeholder="docman@clinic.example" allowClear />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Space style={{ marginTop: 8 }}>
        <Button type="primary" htmlType="submit" loading={saving}>
          Save changes
        </Button>
        <Button onClick={resetAllToDefaults}>Reset all to system defaults</Button>
      </Space>
    </Form>
  );
};

export default AdvancedSettings;
