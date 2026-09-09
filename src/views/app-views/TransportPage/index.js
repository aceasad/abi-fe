import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Grid,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
} from 'antd';
import {
  CarOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Modal from 'components/shared-components/Modal';
import utils from 'utils';
import dayjs from 'utils/dayjs';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import { env } from 'configs/EnvironmentConfig';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { SCHEDULED_APPOINTMENT } from 'constants/ClinicConstants';
import { formatDateByCountry, removeLeadingZeroFromTime } from 'utils/helpers';
import { useDebounce } from 'utils/hooks';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { getSingleAppointment } from 'redux/actions/Appointment';
import appointmentService from 'services/AppointmentService';
import transportService from 'services/TransportService';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import {
  formatPlace,
  rideStatusLabel,
  rideTypeLabel,
  tripTypeLabel,
} from '../AppointmentsPage/AppointmentTransportDetails';
import CancelAppointmentsModal from './CancelAppointmentsModal';

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const MEDIDRIVE_BOOKING_URL =
  env?.MEDIDRIVE_BOOKING_URL || 'https://booking-staging.medidrive.com/login';

const DATE_INPUT_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

// Mirrors TERMINAL_TRIP_STATUSES in abi-be/src/transport/services.py - a ride in one of
// these states can no longer be cancelled.
const TERMINAL_TRIP_STATUSES = new Set([
  'cancelled',
  'canceled',
  'completed',
  'performed',
]);

const isTerminalTrip = (trip) =>
  TERMINAL_TRIP_STATUSES.has(String(trip?.status || '').toLowerCase());

const isCancelledAppointment = (trip) =>
  String(trip?.appointment?.status?.name || '').toLowerCase() === 'cancelled';

// Neither cancel action can do anything for this row, so there is nothing to select.
const isNothingLeftToCancel = (trip) =>
  isTerminalTrip(trip) && isCancelledAppointment(trip);

const TRAILING_OFFSET_PATTERN = /([+-]\d{2}:?\d{2}|Z)$/;

// The pickup window belongs to wherever the patient is being collected, so it must render
// in the pickup location's timezone - plain dayjs(value) would shift it to whatever
// timezone the staff member's browser happens to be in.
const inPickupZone = (value, pickupTimezone) => {
  if (!value) return null;
  if (pickupTimezone) {
    try {
      const zoned = dayjs(value).tz(pickupTimezone);
      if (zoned.isValid()) return zoned;
    } catch {
      // pickup_timezone comes straight from the MediDrive payload; an unknown zone name
      // makes dayjs.tz throw, so fall through to the offset already on the timestamp.
    }
  }
  const offset = String(value).match(TRAILING_OFFSET_PATTERN);
  if (offset) {
    return dayjs(value).utcOffset(offset[1] === 'Z' ? 0 : offset[1]);
  }
  return dayjs(value);
};

const formatWindowTime = (value, pickupTimezone) => {
  const parsed = inPickupZone(value, pickupTimezone);
  return parsed?.isValid() ? parsed.format('hh:mm A') : '';
};

const pickupWindowLabel = (trip) => {
  const start = formatWindowTime(trip?.pickup_window_start, trip?.pickup_timezone);
  const end = formatWindowTime(trip?.pickup_window_end, trip?.pickup_timezone);
  if (start && end) return `${start} - ${end}`;
  return start || end || '-';
};

const distanceLabel = (trip) =>
  trip?.distance_miles == null ? '-' : `${Number(trip.distance_miles).toFixed(1)} mi`;

const TransportPage = () => {
  const dispatch = useDispatch();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const clinic = useSelector(makeSelectClinic());
  const { isTMSEnabled: userIsTMSEnabled } = useSelector(
    (state) => state.auth.user || {}
  );
  const isTMSEnabled = Boolean(clinic?.isTMSEnabled ?? userIsTMSEnabled);

  const [trips, setTrips] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_LIMIT);
  const [dateRange, setDateRange] = useState(null);
  const [appointmentTypeId, setAppointmentTypeId] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const debouncedPatientSearch = useDebounce(patientSearch, 400);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [tripCancelTargets, setTripCancelTargets] = useState(null);
  const [appointmentCancelTargets, setAppointmentCancelTargets] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };
      if (dateRange?.[0]) params.start_date = dateRange[0].format('YYYY-MM-DD');
      if (dateRange?.[1]) params.end_date = dateRange[1].format('YYYY-MM-DD');
      if (appointmentTypeId) params.appointment_type_id = appointmentTypeId;
      // Server-side so the search spans every page, not just the rows on screen.
      if (debouncedPatientSearch.trim()) {
        params.search = debouncedPatientSearch.trim();
      }

      const response = await transportService.getStaffTrips(params);
      const data = response.data;
      const results = Array.isArray(data) ? data : data?.results || [];
      setTrips(results.map((trip) => ({ ...trip, key: trip.id })));
      setCount(Array.isArray(data) ? results.length : data?.count || 0);
    } catch {
      message.error('Failed to load transport trips');
      setTrips([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, dateRange, appointmentTypeId, debouncedPatientSearch]);

  useEffect(() => {
    if (isTMSEnabled) fetchTrips();
  }, [isTMSEnabled, fetchTrips]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAppointmentTypes() {
      try {
        const response = await appointmentService.getAppointmentTypes();
        if (!cancelled) {
          setAppointmentTypes(response.data?.results || response.data || []);
        }
      } catch {
        if (!cancelled) setAppointmentTypes([]);
      }
    }
    fetchAppointmentTypes();
    return () => {
      cancelled = true;
    };
  }, []);

  // Drop selections that are no longer on screen after a refresh or page change.
  useEffect(() => {
    const visibleKeys = new Set(trips.map((trip) => trip.key));
    setSelectedRowKeys((prev) => prev.filter((key) => visibleKeys.has(key)));
  }, [trips]);

  useEffect(() => {
    if (activeAppointment) dispatch(getSingleAppointment(activeAppointment.id));
  }, [activeAppointment, dispatch]);

  // tripTypeLabel needs every leg of an appointment to tell round trips from single ones.
  const tripsByAppointment = useMemo(() => {
    const grouped = new Map();
    trips.forEach((trip) => {
      const appointmentId = trip.appointment?.id;
      if (!grouped.has(appointmentId)) grouped.set(appointmentId, []);
      grouped.get(appointmentId).push(trip);
    });
    return grouped;
  }, [trips]);

  const selectedTrips = useMemo(
    () => trips.filter((trip) => selectedRowKeys.includes(trip.key)),
    [trips, selectedRowKeys]
  );

  // A round trip is two rows on one appointment - cancel it once.
  const uniqueAppointmentIds = (rows) => [
    ...new Set(rows.map((trip) => trip.appointment?.id).filter(Boolean)),
  ];

  const formatAppointmentDateTime = (appointment) => {
    const date = formatDateByCountry(
      appointment?.date,
      clinic?.country,
      DATE_INPUT_FORMATS
    );
    const time = appointment?.time
      ? removeLeadingZeroFromTime(
          dayjs(appointment.time, ['HH:mm', 'h:mm A']).format('hh:mm A')
        )
      : '';
    return [date, time].filter(Boolean).join(' ');
  };

  const handleCancelTrips = async (rows) => {
    const appointmentIds = uniqueAppointmentIds(rows || []);
    if (!appointmentIds.length) return;
    setCancelLoading(true);
    try {
      const response = await transportService.cancelStaffTrips(appointmentIds);
      const results = response.data?.results || [];
      const failed = results.filter((item) => item.status === 'failed').length;
      const cancelled = results.filter(
        (item) => item.action === 'cancelled' && item.status === 'success'
      ).length;

      if (failed) {
        message.warning(
          `${cancelled} ride(s) cancelled, ${failed} could not be cancelled on MediDrive`
        );
      } else if (cancelled) {
        message.success(`${cancelled} appointment(s) had their ride(s) cancelled`);
      } else {
        message.info('No live rides to cancel');
      }
      setSelectedRowKeys([]);
      await fetchTrips();
    } catch {
      message.error('Failed to cancel ride(s)');
    } finally {
      setCancelLoading(false);
      setTripCancelTargets(null);
    }
  };

  const handleCancelAppointments = async (values) => {
    const appointmentIds = uniqueAppointmentIds(appointmentCancelTargets || []);
    if (!appointmentIds.length) return;
    setCancelLoading(true);
    const outcomes = await Promise.allSettled(
      appointmentIds.map((id) =>
        appointmentService.cancelAppointment({ id, data: values })
      )
    );
    const failed = outcomes.filter((item) => item.status === 'rejected').length;
    const succeeded = outcomes.length - failed;

    if (failed) {
      message.warning(
        `${succeeded} appointment(s) cancelled, ${failed} failed`
      );
    } else {
      message.success(
        `${succeeded} appointment(s) and their ride(s) cancelled`
      );
    }
    setSelectedRowKeys([]);
    setCancelLoading(false);
    setAppointmentCancelTargets(null);
    await fetchTrips();
  };

  const openAppointmentCancel = (rows) => {
    const cancellable = rows.filter((trip) => !isCancelledAppointment(trip));
    if (!cancellable.length) {
      message.info('The selected appointment(s) are already cancelled');
      return;
    }
    if (cancellable.length < rows.length) {
      message.info('Skipping appointment(s) that are already cancelled');
    }
    setAppointmentCancelTargets(cancellable);
  };

  if (!isTMSEnabled) {
    return <Redirect to={`${APP_PAGES_PREFIX_PATH}/overview`} />;
  }

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => record.patient?.full_name || '-',
    },
    {
      title: 'Date & time',
      key: 'datetime',
      render: (_, record) => formatAppointmentDateTime(record.appointment),
    },
    {
      title: 'Appointment type',
      key: 'appointmentType',
      render: (_, record) => record.appointment?.appointment_type?.name || '-',
      responsive: ['lg'],
    },
    {
      title: 'Appointment status',
      key: 'appointmentStatus',
      render: (_, record) => record.appointment?.status?.name || '-',
      responsive: ['lg'],
    },
    {
      title: 'Trip Type',
      key: 'tripType',
      render: (_, record) =>
        tripTypeLabel(tripsByAppointment.get(record.appointment?.id)),
    },
    {
      title: 'Ride type',
      key: 'rideType',
      render: (_, record) => rideTypeLabel(record) || '-',
      responsive: ['lg'],
    },
    {
      title: 'Ride Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => rideStatusLabel(status),
    },
    {
      title: 'Pickup',
      dataIndex: 'pickup_place',
      key: 'pickup',
      render: (place) => formatPlace(place) || '-',
      responsive: ['lg'],
    },
    {
      title: 'Dropoff',
      dataIndex: 'dropoff_place',
      key: 'dropoff',
      render: (place) => formatPlace(place) || '-',
      responsive: ['lg'],
    },
    {
      title: 'Pickup window',
      key: 'pickupWindow',
      render: (_, record) => pickupWindowLabel(record),
      responsive: ['lg'],
    },
    {
      title: 'Distance',
      key: 'distance',
      render: (_, record) => distanceLabel(record),
      responsive: ['lg'],
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="text-right">
          <Space>
            <Tooltip
              title={
                isTerminalTrip(record)
                  ? 'This ride can no longer be cancelled'
                  : 'Cancel ride only (appointment stays booked)'
              }
            >
              <Button
                icon={<CloseCircleOutlined />}
                size="small"
                danger
                disabled={isTerminalTrip(record)}
                onClick={(e) => {
                  e.stopPropagation();
                  setTripCancelTargets([record]);
                }}
              />
            </Tooltip>
            <Tooltip
              title={
                isCancelledAppointment(record)
                  ? 'This appointment is already cancelled'
                  : 'Cancel ride and appointment'
              }
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                disabled={isCancelledAppointment(record)}
                onClick={(e) => {
                  e.stopPropagation();
                  openAppointmentCancel([record]);
                }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];

  const filters = (
    <>
      <Input
        placeholder="Search by patient name"
        prefix={<SearchOutlined />}
        value={patientSearch}
        onChange={(e) => {
          setPatientSearch(e.target.value);
          setPage(1);
        }}
        allowClear
        style={{ width: isMobile ? '100%' : 240 }}
      />
      <RangePicker
        value={dateRange}
        onChange={(range) => {
          setDateRange(range);
          setPage(1);
        }}
        format="DD/MM/YYYY"
        style={isMobile ? { width: '100%' } : undefined}
      />
      <Select
        allowClear
        placeholder="Appointment type"
        value={appointmentTypeId}
        onChange={(value) => {
          setAppointmentTypeId(value ?? null);
          setPage(1);
        }}
        options={appointmentTypes.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
        style={{ width: isMobile ? '100%' : 200 }}
      />
    </>
  );

  const medidriveButton = (
    <Button
      icon={<ExportOutlined />}
      onClick={() => window.open(MEDIDRIVE_BOOKING_URL, '_blank', 'noopener')}
      block={isMobile}
    >
      Open MediDrive
    </Button>
  );

  // The destructive actions only mean anything once rows are picked, so they live in a
  // bar that appears on selection instead of sitting greyed out in the filter row.
  const appointmentSelectionCount = uniqueAppointmentIds(selectedTrips).length;

  const selectionBar = selectedRowKeys.length > 0 && (
    <div
      style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: '#fafafa',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
      }}
    >
      <Row gutter={[16, 12]} align="middle">
        <Col flex="auto">
          <Typography.Text strong>
            {`${selectedRowKeys.length} ${
              selectedRowKeys.length > 1 ? 'rides' : 'ride'
            } selected`}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ marginLeft: '8px' }}>
            {`across ${appointmentSelectionCount} ${
              appointmentSelectionCount > 1 ? 'appointments' : 'appointment'
            }`}
          </Typography.Text>
        </Col>
        <Col>
          <Space size="small" wrap>
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              Clear
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => setTripCancelTargets(selectedTrips)}
            >
              Cancel rides
            </Button>
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => openAppointmentCancel(selectedTrips)}
            >
              Cancel rides + appointments
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );

  const TripCard = ({ trip }) => (
    <Card
      hoverable
      styles={{ body: { padding: '16px' } }}
      style={{ height: '100%', borderRadius: '8px' }}
      onClick={() =>
        setActiveAppointment({
          id: trip.appointment?.id,
          type: SCHEDULED_APPOINTMENT,
        })
      }
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space>
          <CarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Typography.Text strong style={{ fontSize: '16px' }}>
            {trip.patient?.full_name || '-'}
          </Typography.Text>
        </Space>
        <Typography.Text type="secondary">
          {formatAppointmentDateTime(trip.appointment)}
        </Typography.Text>
        <Typography.Text type="secondary">
          {trip.appointment?.appointment_type?.name || '-'}
        </Typography.Text>
        <Typography.Text type="secondary">
          {`${tripTypeLabel(tripsByAppointment.get(trip.appointment?.id))} - ${rideStatusLabel(trip.status)}`}
        </Typography.Text>
        {formatPlace(trip.pickup_place) && (
          <Typography.Text type="secondary">
            {`Pickup: ${formatPlace(trip.pickup_place)}`}
          </Typography.Text>
        )}
        {formatPlace(trip.dropoff_place) && (
          <Typography.Text type="secondary">
            {`Dropoff: ${formatPlace(trip.dropoff_place)}`}
          </Typography.Text>
        )}
        <Space
          style={{ width: '100%', justifyContent: 'flex-end', marginTop: '8px' }}
        >
          <Tooltip title="Cancel ride only (appointment stays booked)">
            <Button
              icon={<CloseCircleOutlined />}
              size="small"
              danger
              disabled={isTerminalTrip(trip)}
              onClick={(e) => {
                e.stopPropagation();
                setTripCancelTargets([trip]);
              }}
            />
          </Tooltip>
          <Tooltip title="Cancel ride and appointment">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              disabled={isCancelledAppointment(trip)}
              onClick={(e) => {
                e.stopPropagation();
                openAppointmentCancel([trip]);
              }}
            />
          </Tooltip>
        </Space>
      </Space>
    </Card>
  );

  return (
    <Layout style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div
        className="mb-4"
        style={{ paddingTop: isMobile ? '8px' : '24px', marginBottom: '24px' }}
      >
        {isMobile ? (
          <>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Transport
            </Typography.Title>
            <Space
              direction="vertical"
              size="small"
              style={{ width: '100%', marginTop: '16px' }}
            >
              {filters}
              {medidriveButton}
            </Space>
          </>
        ) : (
          <>
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Transport
                </Typography.Title>
              </Col>
              <Col>{medidriveButton}</Col>
            </Row>
            <Space size="middle" wrap style={{ marginTop: '20px' }}>
              {filters}
            </Space>
          </>
        )}
        {selectionBar}
      </div>

      {isMobile ? (
        trips.length > 0 ? (
          <Row gutter={[12, 12]}>
            {trips.map((trip) => (
              <Col xs={24} sm={12} key={trip.key}>
                <TripCard trip={trip} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <Typography.Text type="secondary">
              No transport trips available
            </Typography.Text>
          </Card>
        )
      ) : (
        <div className="table-responsive ant-table-row-pointer">
          <Table
            columns={columns}
            dataSource={trips}
            loading={loading}
            onRow={(record) => ({
              onClick: () =>
                setActiveAppointment({
                  id: record.appointment?.id,
                  type: SCHEDULED_APPOINTMENT,
                }),
            })}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
              getCheckboxProps: (record) => ({
                disabled: isNothingLeftToCancel(record),
              }),
              // Say why the row cannot be picked, otherwise a fully cancelled row just
              // reads as a dead checkbox.
              renderCell: (checked, record, index, originNode) =>
                isNothingLeftToCancel(record) ? (
                  <Tooltip title="This ride and its appointment are already cancelled">
                    <span>{originNode}</span>
                  </Tooltip>
                ) : (
                  originNode
                ),
            }}
            pagination={{
              current: page,
              pageSize,
              total: count,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              hideOnSinglePage: false,
              onChange: (nextPage, nextPageSize) => {
                setPage(nextPage);
                setPageSize(nextPageSize);
              },
            }}
          />
        </div>
      )}

      <Modal
        title="Cancel ride(s)"
        description={
          tripCancelTargets
            ? `This cancels every live ride on ${
                uniqueAppointmentIds(tripCancelTargets).length
              } appointment(s), including the return leg of a round trip. The appointment(s) stay booked.`
            : ''
        }
        primaryAction="Cancel ride(s)"
        secondaryAction="Close"
        visible={!!tripCancelTargets}
        confirmLoading={cancelLoading}
        handlePrimaryAction={() => handleCancelTrips(tripCancelTargets)}
        handleSecondaryAction={() => setTripCancelTargets(null)}
      />

      {appointmentCancelTargets && (
        <CancelAppointmentsModal
          appointmentIds={uniqueAppointmentIds(appointmentCancelTargets)}
          loading={cancelLoading}
          handleClose={() => setAppointmentCancelTargets(null)}
          handleConfirm={handleCancelAppointments}
        />
      )}

      {activeAppointment && (
        <AppointmentPreview
          handleClose={() => {
            setActiveAppointment(null);
            fetchTrips();
          }}
          appointment_type={activeAppointment.type}
        />
      )}
    </Layout>
  );
};

export default TransportPage;
