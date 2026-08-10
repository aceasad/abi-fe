import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Table,
  Typography,
  message,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import locationService from 'services/LocationService';
import appointmentService from 'services/AppointmentService';
import Loading from 'components/shared-components/Loading';
import LocationTimeslotsDrawer from './LocationTimeslotsDrawer';

const { Text } = Typography;

const EMPTY_FORM = {
  name: '',
  description: '',
  street1: '',
  street2: '',
  city: '',
  state: '',
  postcode: '',
  phone: '',
  scheduling_phone: '',
  is_active: true,
};

const ClinicLocations = () => {
  const { PASProvider, isTMSEnabled, isPasIntegrated } = useSelector(
    (state) => state.auth.user || {}
  );
  const isInternal =
    (PASProvider || '').toLowerCase() === 'internal' && !isPasIntegrated;
  const [locations, setLocations] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [timeslotLocation, setTimeslotLocation] = useState(null);
  const [form] = Form.useForm();

  const loadLocations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await locationService.listLocations();
      setLocations(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      message.error('Failed to load clinic locations');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAppointmentTypes = useCallback(async () => {
    try {
      const { data } = await appointmentService.getAppointmentTypes();
      setAppointmentTypes(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setAppointmentTypes([]);
    }
  }, []);

  useEffect(() => {
    if (isInternal) {
      loadLocations();
      loadAppointmentTypes();
    } else {
      setLoading(false);
    }
  }, [isInternal, loadLocations, loadAppointmentTypes]);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name || '',
      description: record.description || '',
      street1: record.street1 || '',
      street2: record.street2 || '',
      city: record.city || '',
      state: record.state || '',
      postcode: record.postcode || '',
      phone: record.phone || '',
      scheduling_phone: record.scheduling_phone || '',
      is_active: record.is_active !== false,
    });
    setModalOpen(true);
  };

  const openTimeslots = (record) => {
    setTimeslotLocation(record);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) {
        await locationService.updateLocation(editing.id, values);
        message.success('Location updated');
      } else {
        await locationService.createLocation(values);
        message.success(
          isTMSEnabled
            ? 'Location created — MediDrive LOB sync will populate TMS LOB ID shortly'
            : 'Location created'
        );
      }
      setModalOpen(false);
      await loadLocations();
    } catch (err) {
      if (err?.errorFields) return;
      const apiMessage =
        err?.response?.data?.name?.[0] ||
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to save location';
      message.error(apiMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      await locationService.deleteLocation(record.id);
      message.success('Location deleted');
      await loadLocations();
    } catch (err) {
      message.error(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          'Failed to delete location'
      );
    }
  };

  if (!isInternal) {
    return (
      <Text type="secondary">
        Clinic locations are managed here for Internal (Local PAS Broker) organizations only.
      </Text>
    );
  }

  if (loading) {
    return <Loading />;
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 80,
    },
    {
      title: 'Zip',
      dataIndex: 'postcode',
      key: 'postcode',
      width: 100,
    },
    {
      title: 'TMS LOB ID',
      dataIndex: 'tms_lob_id',
      key: 'tms_lob_id',
      render: (value) =>
        value ? (
          <Text code>{value}</Text>
        ) : (
          <Text type="secondary">{isTMSEnabled ? 'Pending sync' : 'TMS disabled'}</Text>
        ),
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (value) => (value ? 'Yes' : 'No'),
    },
    {
      title: 'Timeslots',
      key: 'timeslots',
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => openTimeslots(record)} style={{ padding: 0 }}>
          Manage
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete this location?"
            description="If TMS is enabled, the linked MediDrive LOB will also be soft-deleted."
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        gutter={[24, 16]}
        style={{ marginBottom: 16 }}
        wrap={false}
      >
        <Col flex="auto">
          <Text type="secondary">
            Manage clinic locations used for booking. When transport (TMS) is enabled for
            this organization, creating a location automatically creates a MediDrive line of
            business.
          </Text>
        </Col>
        <Col flex="none" style={{ paddingLeft: 24 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add location
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={locations}
        pagination={false}
        scroll={{ x: true }}
      />

      <LocationTimeslotsDrawer
        open={Boolean(timeslotLocation)}
        location={timeslotLocation}
        appointmentTypes={appointmentTypes}
        onClose={() => setTimeslotLocation(null)}
      />

      <Modal
        title={editing ? 'Edit location' : 'Add location'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText={editing ? 'Save' : 'Create'}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={EMPTY_FORM}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: 'Name is required' },
                  {
                    validator: (_, value) =>
                      value && value.includes(';')
                        ? Promise.reject(new Error('Name must not contain a semicolon (;)'))
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="Description">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="street1" label="Street 1">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="street2" label="Street 2">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="State">
                <Input maxLength={2} placeholder="NY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="postcode" label="Zip Code">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="scheduling_phone" label="Scheduling phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_active" label="Active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            {editing && (
              <Col span={12}>
                <Form.Item label="TMS LOB ID">
                  <Input value={editing.tms_lob_id || ''} disabled />
                </Form.Item>
              </Col>
            )}
            {editing && (editing.latitude != null || editing.longitude != null) && (
              <Col span={24}>
                <Text type="secondary">
                  Coordinates (read-only): {editing.latitude}, {editing.longitude}
                </Text>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ClinicLocations;
