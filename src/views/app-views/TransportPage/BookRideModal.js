import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { useSelector } from 'react-redux';
import { useDebounce } from 'utils/hooks';
import { formatDateByCountry, isUkCountry, isUsCountry, removeLeadingZeroFromTime } from 'utils/helpers';
import dayjs from 'utils/dayjs';
import { LARGE_PAGINATION_LIMIT, ORDERING } from 'constants/ApiConstant';
import {
  UK_POSTCODE_ERROR,
  UK_POSTCODE_PLACEHOLDER,
  UK_POSTCODE_REGEX,
  US_STATE_SELECT_OPTIONS,
  US_ZIP_ERROR,
  US_ZIP_PLACEHOLDER,
  US_ZIP_REGEX,
} from 'constants/AddressConstants';
import { useCityOptions } from 'utils/useCityOptions';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import patientService from 'services/PatientService';
import transportService from 'services/TransportService';

const TERMINAL_TRIP_STATUSES = new Set([
  'cancelled',
  'canceled',
  'completed',
  'performed',
]);

const hasActiveTrip = (appointment) =>
  (appointment?.trips || []).some(
    (trip) => !TERMINAL_TRIP_STATUSES.has(String(trip?.status || '').toLowerCase())
  );

const listFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const popupInField = (trigger) => trigger.parentElement;

const BookRideModal = ({ open, onClose, onBooked }) => {
  const clinic = useSelector(makeSelectClinic());
  const isUSA = isUsCountry(clinic?.country);
  const isUK = isUkCountry(clinic?.country);
  const [form] = Form.useForm();
  const selectedState = Form.useWatch('state', form);
  const selectedCity = Form.useWatch('city', form);
  const {
    options: cityOptions,
    loading: citiesLoading,
    disabled: cityDisabled,
    useDropdown: cityIsDropdown,
  } = useCityOptions({
    country: isUSA ? 'United States' : isUK ? 'United Kingdom' : clinic?.country,
    state: selectedState,
    currentCity: selectedCity,
  });
  const [patientQuery, setPatientQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTypesLoading, setServiceTypesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const debouncedQuery = useDebounce(patientQuery, 400);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    async function search() {
      if (!debouncedQuery.trim()) {
        setPatients([]);
        return;
      }
      setPatientsLoading(true);
      try {
        const { data } = await patientService.getPatients({
          search: debouncedQuery.trim(),
          page: 1,
          field: 'last_name',
          order: ORDERING.ASC,
        });
        if (!cancelled) setPatients(listFromResponse(data));
      } catch {
        if (!cancelled) {
          setPatients([]);
          message.error('Failed to search patients');
        }
      } finally {
        if (!cancelled) setPatientsLoading(false);
      }
    }
    search();
    return () => {
      cancelled = true;
    };
  }, [open, debouncedQuery]);

  const reset = () => {
    form.resetFields();
    setPatientQuery('');
    setPatients([]);
    setAppointments([]);
    setServiceTypes([]);
  };

  const close = () => {
    reset();
    onClose();
  };

  const loadAppointments = async (patientId) => {
    form.setFieldsValue({ appointment_id: undefined, service_type_id: undefined });
    setAppointments([]);
    setServiceTypes([]);
    if (!patientId) return;
    setAppointmentsLoading(true);
    try {
      const { data } = await patientService.getScheduledAppointments(patientId, {
        limit: LARGE_PAGINATION_LIMIT,
      });
      setAppointments(listFromResponse(data).filter((appointment) => !hasActiveTrip(appointment)));
    } catch {
      message.error('Failed to load scheduled appointments');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const loadServiceTypes = async (appointmentId) => {
    form.setFieldsValue({ service_type_id: undefined });
    setServiceTypes([]);
    if (!appointmentId) return;
    setServiceTypesLoading(true);
    try {
      const { data } = await transportService.getServiceTypes(appointmentId);
      const types = listFromResponse(data);
      setServiceTypes(types);
      const first = types[0];
      const firstId = first?.service_type_id || first?.id;
      if (firstId) form.setFieldsValue({ service_type_id: firstId });
    } catch {
      message.error('Failed to load service types');
    } finally {
      setServiceTypesLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const line1 = values.line_1?.trim();
    const payload = {
      patient_id: values.patient_id,
      appointment_id: values.appointment_id,
      service_type_id: values.service_type_id,
      trip_type: values.trip_type || 'single',
    };
    if (line1) {
      payload.pickup_place = {
        line_1: line1,
        city: values.city?.trim(),
        state: values.state?.trim(),
        zip: values.zip?.trim(),
      };
    }
    setSaving(true);
    try {
      await transportService.bookStaffTrip(payload);
      message.success('Ride booked');
      reset();
      onBooked();
    } catch (error) {
      const detail = error?.response?.data?.message;
      message.error(detail || 'Failed to book the ride');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Book ride"
      open={open}
      onCancel={close}
      onOk={() => form.submit()}
      okText="Book ride"
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ trip_type: 'single' }}
        onFinish={handleSubmit}
        onValuesChange={(changed) => {
          if (Object.prototype.hasOwnProperty.call(changed, 'state')) {
            form.setFieldsValue({ city: undefined });
          }
        }}
      >
        <Form.Item
          label="Patient"
          name="patient_id"
          rules={[{ required: true, message: 'Select a patient' }]}
        >
          <Select
            showSearch
            filterOption={false}
            placeholder="Search patients"
            loading={patientsLoading}
            getPopupContainer={popupInField}
            onSearch={setPatientQuery}
            onChange={loadAppointments}
            notFoundContent={patientsLoading ? 'Searching…' : 'No patients found'}
            options={patients.map((patient) => ({
              value: patient.id,
              label: patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Appointment"
          name="appointment_id"
          rules={[{ required: true, message: 'Select an appointment' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Scheduled appointment without a ride"
            loading={appointmentsLoading}
            getPopupContainer={popupInField}
            onChange={loadServiceTypes}
            notFoundContent={
              appointmentsLoading ? 'Loading…' : 'No scheduled appointments without a ride'
            }
            options={appointments.map((appointment) => ({
              value: appointment.id,
              label: [
                formatDateByCountry(appointment.date, clinic?.country, [
                  'DD/MM/YYYY',
                  'MM/DD/YYYY',
                  'YYYY-MM-DD',
                ]),
                appointment.time
                  ? removeLeadingZeroFromTime(
                      dayjs(appointment.time, ['HH:mm', 'h:mm A']).format('hh:mm A')
                    )
                  : '',
                appointment.appointment_type?.name,
              ]
                .filter(Boolean)
                .join(' · '),
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Service type"
          name="service_type_id"
          rules={[{ required: true, message: 'Select a service type' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Service type"
            loading={serviceTypesLoading}
            getPopupContainer={popupInField}
            notFoundContent={serviceTypesLoading ? 'Loading…' : 'No service types for this appointment'}
            options={serviceTypes.map((serviceType) => {
              const id = serviceType.service_type_id || serviceType.id;
              return { value: id, label: serviceType.name || id };
            })}
          />
        </Form.Item>
        <Form.Item label="Trip type" name="trip_type">
          <Select
            getPopupContainer={popupInField}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'round_trip', label: 'Round trip' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Pickup line (Optional, otherwise Patient's Home address is used)"
          name="line_1"
        >
          <Input placeholder="100 Main St" />
        </Form.Item>
        <Row gutter={16}>
          {isUSA && (
            <Col span={12}>
              <Form.Item label="State" name="state">
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  placeholder="Select state"
                  getPopupContainer={popupInField}
                  options={US_STATE_SELECT_OPTIONS}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={isUSA ? 12 : 24}>
            <Form.Item label="City" name="city">
              {cityIsDropdown ? (
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  placeholder={cityDisabled ? 'Select state first' : 'Select city'}
                  getPopupContainer={popupInField}
                  options={cityOptions.map((city) => ({
                    value: city.id,
                    label: city.name,
                  }))}
                  loading={citiesLoading}
                  disabled={cityDisabled}
                />
              ) : (
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={isUSA ? 'Zip Code' : 'Postcode'}
          name="zip"
          rules={[
            {
              validator: (_, value) => {
                const text = String(value || '').trim();
                if (!text) return Promise.resolve();
                const pattern = isUSA ? US_ZIP_REGEX : UK_POSTCODE_REGEX;
                if (pattern.test(text)) return Promise.resolve();
                return Promise.reject(new Error(isUSA ? US_ZIP_ERROR : UK_POSTCODE_ERROR));
              },
            },
          ]}
        >
          <Input placeholder={isUSA ? US_ZIP_PLACEHOLDER : UK_POSTCODE_PLACEHOLDER} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookRideModal;
