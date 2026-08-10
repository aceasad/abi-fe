import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TimePicker,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import appointmentService from 'services/AppointmentService';
import dayjs from 'utils/dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const formatWallClock = (value) =>
  dayjs(value).format('YYYY-MM-DDTHH:mm:ss');

const generateSlots = ({
  dateRange,
  timeRange,
  durationMinutes,
}) => {
  if (!dateRange?.[0] || !dateRange?.[1] || !timeRange?.[0] || !timeRange?.[1]) {
    return [];
  }
  if (!durationMinutes || durationMinutes < 1) {
    return [];
  }

  const slots = [];
  let day = dateRange[0].startOf('day');
  const lastDay = dateRange[1].startOf('day');
  const startMinutes = timeRange[0].hour() * 60 + timeRange[0].minute();
  const endMinutes = timeRange[1].hour() * 60 + timeRange[1].minute();

  if (endMinutes <= startMinutes) {
    return [];
  }

  while (day.isSameOrBefore(lastDay, 'day')) {
    let cursorMinutes = startMinutes;
    while (cursorMinutes + durationMinutes <= endMinutes) {
      const start = day
        .hour(Math.floor(cursorMinutes / 60))
        .minute(cursorMinutes % 60)
        .second(0)
        .millisecond(0);
      const end = start.add(durationMinutes, 'minute');
      slots.push({
        start_datetime: formatWallClock(start),
        end_datetime: formatWallClock(end),
      });
      cursorMinutes += durationMinutes;
    }
    day = day.add(1, 'day');
  }
  return slots;
};

const LocationTimeslotsDrawer = ({
  open,
  location,
  appointmentTypes = [],
  onClose,
  onChanged,
}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState(undefined);
  const [filterBooked, setFilterBooked] = useState(undefined);
  const [filterDates, setFilterDates] = useState(null);
  const [addForm] = Form.useForm();
  const watchedDateRange = Form.useWatch('dateRange', addForm);
  const watchedTimeRange = Form.useWatch('timeRange', addForm);
  const watchedDuration = Form.useWatch('durationMinutes', addForm);

  const typeName = useCallback(
    (typeId) =>
      appointmentTypes.find((t) => String(t.id) === String(typeId))?.name ||
      typeId,
    [appointmentTypes]
  );

  const loadSlots = useCallback(async () => {
    if (!location?.id) return;
    setLoading(true);
    try {
      const params = {
        location: location.id,
        limit: 200,
      };
      if (filterType) {
        params.appointment_type = filterType;
      }
      if (filterBooked !== undefined && filterBooked !== null && filterBooked !== '') {
        params.is_booked = filterBooked;
      }
      if (filterDates?.[0]) {
        params.start_after = filterDates[0].startOf('day').toISOString();
      }
      if (filterDates?.[1]) {
        params.start_before = filterDates[1].endOf('day').toISOString();
      }
      const { data } = await appointmentService.listTimeslots(params);
      setSlots(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      message.error('Failed to load timeslots');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [location?.id, filterType, filterBooked, filterDates]);

  useEffect(() => {
    if (open && location?.id) {
      loadSlots();
    }
  }, [open, location?.id, loadSlots]);

  useEffect(() => {
    if (open) {
      addForm.setFieldsValue({
        appointment_type: undefined,
        dateRange: [dayjs(), dayjs().add(6, 'day')],
        timeRange: [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')],
        durationMinutes: undefined,
      });
    }
  }, [open, addForm]);

  const handleAppointmentTypeChange = (typeId) => {
    const selected = appointmentTypes.find(
      (t) => String(t.id) === String(typeId)
    );
    addForm.setFieldsValue({
      appointment_type: typeId,
      durationMinutes: selected?.duration ?? undefined,
    });
  };

  const previewSlots = useMemo(
    () =>
      generateSlots({
        dateRange: watchedDateRange,
        timeRange: watchedTimeRange,
        durationMinutes: watchedDuration,
      }),
    [watchedDateRange, watchedTimeRange, watchedDuration]
  );

  const handleDelete = async (record) => {
    try {
      await appointmentService.deleteTimeslot(record.id);
      message.success('Timeslot deleted');
      await loadSlots();
      onChanged?.();
    } catch (err) {
      message.error(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          'Failed to delete timeslot'
      );
    }
  };

  const handleBulkCreate = async () => {
    try {
      const values = await addForm.validateFields();
      const generated = generateSlots({
        dateRange: values.dateRange,
        timeRange: values.timeRange,
        durationMinutes: values.durationMinutes,
      });
      if (!generated.length) {
        message.error('No slots to create with the selected settings');
        return;
      }
      setSaving(true);
      await appointmentService.bulkCreateTimeslots({
        location: location.id,
        appointment_type: values.appointment_type,
        slots: generated,
      });
      message.success(`Created ${generated.length} timeslot${generated.length === 1 ? '' : 's'}`);
      await loadSlots();
      onChanged?.();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          (typeof err?.response?.data === 'string' ? err.response.data : null) ||
          'Failed to create timeslots'
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Start',
      dataIndex: 'start_datetime',
      key: 'start',
      render: (value) => dayjs(value).format('DD MMM YYYY HH:mm'),
    },
    {
      title: 'End',
      dataIndex: 'end_datetime',
      key: 'end',
      render: (value) => dayjs(value).format('DD MMM YYYY HH:mm'),
    },
    {
      title: 'Appointment type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      render: (value) => typeName(value),
    },
    {
      title: 'Booked',
      dataIndex: 'is_booked',
      key: 'is_booked',
      width: 90,
      render: (value) => (value ? 'Yes' : 'No'),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) =>
        record.is_booked ? (
          <Button type="link" danger icon={<DeleteOutlined />} disabled />
        ) : (
          <Popconfirm
            title="Delete this timeslot?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        ),
    },
  ];

  return (
    <Drawer
      title={location ? `Timeslots — ${location.name}` : 'Timeslots'}
      open={open}
      onClose={onClose}
      width={820}
      destroyOnClose
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8}>
            <Select
              allowClear
              placeholder="Appointment type"
              style={{ width: '100%' }}
              value={filterType}
              onChange={setFilterType}
              options={appointmentTypes.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
            />
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={filterDates}
              onChange={setFilterDates}
            />
          </Col>
          <Col xs={24} sm={5}>
            <Select
              allowClear
              placeholder="Booked"
              style={{ width: '100%' }}
              value={filterBooked}
              onChange={setFilterBooked}
              options={[
                { value: 'false', label: 'Available' },
                { value: 'true', label: 'Booked' },
              ]}
            />
          </Col>
          <Col xs={24} sm={3}>
            <Button onClick={loadSlots} block>
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          size="small"
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={slots}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: 'No timeslots yet.' }}
          scroll={{ x: true }}
        />

        <Divider style={{ margin: '8px 0' }} />

        <Title level={5} style={{ margin: 0 }}>
          Add timeslots
        </Title>
        <Text type="secondary">
          Generates slots for each day in the date range within the daily time window.
        </Text>

        <Form form={addForm} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="appointment_type"
                label="Appointment type"
                rules={[{ required: true, message: 'Select an appointment type' }]}
              >
                <Select
                  placeholder="Select type"
                  onChange={handleAppointmentTypeChange}
                  options={appointmentTypes.map((t) => ({
                    value: t.id,
                    label: t.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="durationMinutes"
                label="Slot duration (minutes)"
                extra="Taken from the selected appointment type"
                rules={[
                  {
                    required: true,
                    message: 'Select an appointment type with a duration',
                  },
                ]}
              >
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dateRange"
                label="Date range"
                rules={[{ required: true, message: 'Select a date range' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="timeRange"
                label="Daily time window"
                rules={[{ required: true, message: 'Select a time window' }]}
              >
                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Text type="secondary">
              Will create {previewSlots.length} timeslot
              {previewSlots.length === 1 ? '' : 's'}
            </Text>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={saving}
              disabled={!previewSlots.length}
              onClick={handleBulkCreate}
            >
              Create timeslots
            </Button>
          </Space>
        </Form>
      </Space>
    </Drawer>
  );
};

export default LocationTimeslotsDrawer;
