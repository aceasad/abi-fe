import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Col,
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
  ExportOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import utils from 'utils';
import dayjs from 'utils/dayjs';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import { env } from 'configs/EnvironmentConfig';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { SCHEDULED_APPOINTMENT } from 'constants/ClinicConstants';
import { formatDateByCountry, formatLocationLabel, removeLeadingZeroFromTime } from 'utils/helpers';
import { useDebounce } from 'utils/hooks';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { getSingleAppointment } from 'redux/actions/Appointment';
import patientService from 'services/PatientService';
import transportService from 'services/TransportService';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { rideStatusLabel } from '../AppointmentsPage/AppointmentTransportDetails';
import BookRideModal from './BookRideModal';
import CancelAppointmentsModal from './CancelAppointmentsModal';
import CancelChoiceModal from './CancelChoiceModal';

const { useBreakpoint } = Grid;

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
  'tp declined',
]);

const isTerminalTrip = (trip) =>
  TERMINAL_TRIP_STATUSES.has(String(trip?.status || '').toLowerCase());

const isCancelledAppointment = (trip) =>
  String(trip?.appointment?.status?.name || '').toLowerCase() === 'cancelled';

// Neither cancel action can do anything for this row, so there is nothing to select.
const isNothingLeftToCancel = (trip) =>
  isTerminalTrip(trip) && isCancelledAppointment(trip);

const canActivateReturn = (trip) =>
  trip?.leg_role === 'return' &&
  trip?.pickup_type === 'will_call' &&
  !trip?.activated_at &&
  !isTerminalTrip(trip);

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

const isCompletedRide = (trip) =>
  ['completed', 'performed'].includes(String(trip?.status || '').toLowerCase());

const rideTimingLabel = (trip) => {
  if (!trip) return '';
  if (isCompletedRide(trip) && trip.dropped_off_at) {
    const dropped = formatWindowTime(trip.dropped_off_at, trip.pickup_timezone);
    return dropped ? `Dropped off ${dropped}` : 'Dropped off';
  }
  const windowLabel = pickupWindowLabel(trip);
  return windowLabel === '-' ? '' : windowLabel;
};

const BUCKETS = [
  { key: 'attention', label: 'Needs attention' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

const TRIP_TYPE_OPTIONS = [
  { value: 'single', label: 'Single trip' },
  { value: 'round_trip', label: 'Round trip' },
];

const RIDE_STATUS_OPTIONS = [
  { value: 'waiting', label: 'Will Call' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'en_route', label: 'En route' },
  { value: 'arrived_at_pickup', label: 'Arrived at pickup' },
  { value: 'arrived_at_destination', label: 'Arrived at destination' },
  { value: 'completed', label: 'Completed' },
  { value: 'performed', label: 'Performed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'tp declined', label: 'TP declined' },
];

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
  const [buckets, setBuckets] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_LIMIT);
  const [bucket, setBucket] = useState('today');
  const [tripType, setTripType] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const debouncedPatientSearch = useDebounce(patientSearch, 400);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [cancelChoiceTargets, setCancelChoiceTargets] = useState(null);
  const [appointmentCancelTargets, setAppointmentCancelTargets] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [bookRideOpen, setBookRideOpen] = useState(false);
  const [activatingTripId, setActivatingTripId] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        bucket,
      };
      if (locationId) params.location = locationId;
      if (tripType) params.trip_type = tripType;
      if (rideStatus) params.status = rideStatus;
      // Server-side so the search spans every page, not just the rows on screen.
      if (debouncedPatientSearch.trim()) {
        params.search = debouncedPatientSearch.trim();
      }

      const response = await transportService.getStaffTrips(params);
      const data = response.data;
      const results = Array.isArray(data) ? data : data?.results || [];
      setTrips(results.map((trip) => ({ ...trip, key: trip.id })));
      setCount(Array.isArray(data) ? results.length : data?.count || 0);
      setBuckets(data?.buckets || {});
    } catch {
      message.error('Failed to load transport trips');
      setTrips([]);
      setCount(0);
      setBuckets({});
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, bucket, locationId, tripType, rideStatus, debouncedPatientSearch]);

  useEffect(() => {
    if (isTMSEnabled) fetchTrips();
  }, [isTMSEnabled, fetchTrips]);

  useEffect(() => {
    let cancelled = false;
    patientService
      .getPatientLocations()
      .then(({ data }) => {
        if (cancelled) return;
        const options = (Array.isArray(data) ? data : [])
          .filter((item) => item?.location_id)
          .map((item) => {
            const id = String(item.location_id);
            return {
              value: id,
              label: formatLocationLabel(item, id),
            };
          });
        setLocations(options);
      })
      .catch(() => {
        if (!cancelled) setLocations([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeAppointment) dispatch(getSingleAppointment(activeAppointment.id));
  }, [activeAppointment, dispatch]);

  const appointmentRows = useMemo(() => {
    const grouped = new Map();
    trips.forEach((trip) => {
      const appointmentId = trip.appointment?.id;
      if (!grouped.has(appointmentId)) {
        grouped.set(appointmentId, {
          key: appointmentId,
          appointment: trip.appointment,
          patient: trip.patient,
          legs: [],
          rideThere: null,
          rideHome: null,
        });
      }
      const row = grouped.get(appointmentId);
      row.legs.push(trip);
      if (trip.leg_role === 'return') row.rideHome = trip;
      else row.rideThere = trip;
    });
    return [...grouped.values()];
  }, [trips]);

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

  const handleActivateReturn = async (trip) => {
    const appointmentId = trip?.appointment?.id;
    if (!appointmentId) return;
    setActivatingTripId(trip.id);
    try {
      const response = await transportService.activateReturnTrip(appointmentId);
      message.success(
        response.data?.window_updated
          ? 'Ride home started. The pickup window was moved to now.'
          : 'Ride home started.'
      );
      await fetchTrips();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Could not start the ride home');
    } finally {
      setActivatingTripId(null);
    }
  };

  const activateReturnButton = (trip) =>
    canActivateReturn(trip) ? (
      <Button
        size="small"
        loading={activatingTripId === trip.id}
        onClick={(event) => {
          event.stopPropagation();
          handleActivateReturn(trip);
        }}
      >
        Activate
      </Button>
    ) : null;

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
        message.success(
          cancelled > 1
            ? `${cancelled} rides cancelled. The appointments stay booked.`
            : 'Ride cancelled. The appointment stays booked.'
        );
      } else {
        message.info('No live rides to cancel');
      }
      setActiveAppointment(null);
      await fetchTrips();
    } catch {
      message.error('Failed to cancel ride(s)');
    } finally {
      setCancelLoading(false);
      setCancelChoiceTargets(null);
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
    setCancelLoading(false);
    setAppointmentCancelTargets(null);
    setActiveAppointment(null);
    await fetchTrips();
  };

  const openCancelChoice = (rows) => {
    const actionable = rows.filter((trip) => !isNothingLeftToCancel(trip));
    if (!actionable.length) {
      message.info('Nothing left to cancel');
      return;
    }
    setCancelChoiceTargets(actionable);
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

  const openAppointment = (appointmentId) => {
    if (!appointmentId) return;
    setActiveAppointment({
      id: appointmentId,
      type: SCHEDULED_APPOINTMENT,
    });
  };

  const openInMediDrive = (trip) => (
    <Tooltip title={trip?.trip_url ? 'Open this trip in MediDrive' : 'Trip URL not available yet'}>
      <Button
        icon={<ExportOutlined />}
        size="small"
        disabled={!trip?.trip_url}
        onClick={(event) => {
          event.stopPropagation();
          if (trip?.trip_url) {
            window.open(trip.trip_url, '_blank', 'noopener');
          }
        }}
      />
    </Tooltip>
  );

  const rideCell = (trip, emptyLabel) => {
    if (!trip) {
      return <Typography.Text type="secondary">{emptyLabel}</Typography.Text>;
    }
    const timing = rideTimingLabel(trip);
    return (
      <Space align="start" onClick={(event) => event.stopPropagation()}>
        <div>
          <div>{rideStatusLabel(trip.status, trip)}</div>
          {timing && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {timing}
            </Typography.Text>
          )}
        </div>
        {openInMediDrive(trip)}
      </Space>
    );
  };

  const rowActions = (record) => (
    <Space onClick={(event) => event.stopPropagation()}>
      {activateReturnButton(record.rideHome)}
      <Button size="small" onClick={() => openAppointment(record.appointment?.id)}>
        Open
      </Button>
    </Space>
  );

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => record.patient?.full_name || '-',
    },
    {
      title: 'Appointment',
      key: 'appointment',
      render: (_, record) => (
        <div>
          <div>{formatAppointmentDateTime(record.appointment) || '-'}</div>
          <Typography.Text type="secondary">
            {record.appointment?.appointment_type?.name || '-'}
          </Typography.Text>
          {record.appointment?.location_name && (
            <div>
              <Typography.Text type="secondary">
                {record.appointment.location_name}
              </Typography.Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Trip',
      key: 'tripType',
      render: (_, record) => (record.rideHome ? 'Round trip' : 'Single trip'),
    },
    {
      title: 'Ride there',
      key: 'rideThere',
      render: (_, record) => rideCell(record.rideThere, '-'),
    },
    {
      title: 'Ride home',
      key: 'rideHome',
      render: (_, record) => rideCell(record.rideHome, 'No ride home'),
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => rowActions(record),
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
      <Select
        allowClear
        placeholder="Location"
        value={locationId}
        onChange={(value) => {
          setLocationId(value ?? null);
          setPage(1);
        }}
        options={locations}
        style={{ width: isMobile ? '100%' : 200 }}
      />
      <Select
        allowClear
        placeholder="Trip type"
        value={tripType}
        onChange={(value) => {
          setTripType(value ?? null);
          setPage(1);
        }}
        options={TRIP_TYPE_OPTIONS}
        style={{ width: isMobile ? '100%' : 160 }}
      />
      <Select
        allowClear
        placeholder="Ride status"
        value={rideStatus}
        onChange={(value) => {
          setRideStatus(value ?? null);
          setPage(1);
        }}
        options={RIDE_STATUS_OPTIONS}
        style={{ width: isMobile ? '100%' : 200 }}
      />
    </>
  );

  const medidriveButton = (
    <Space
      className="transport-header-actions"
      align="center"
      direction={isMobile ? 'vertical' : 'horizontal'}
      style={{ width: isMobile ? '100%' : undefined }}
    >
      <Button
        type="primary"
        icon={<CarOutlined />}
        onClick={() => setBookRideOpen(true)}
        block={isMobile}
      >
        Book ride
      </Button>
      <Button
        icon={<ExportOutlined />}
        onClick={() => window.open(MEDIDRIVE_BOOKING_URL, '_blank', 'noopener')}
        block={isMobile}
      >
        Open MediDrive
      </Button>
    </Space>
  );

  const pills = (
    <Space wrap size="small">
      {BUCKETS.map((item) => {
        const selected = bucket === item.key;
        const total = buckets[item.key];
        return (
          <Button
            key={item.key}
            type={selected ? 'primary' : 'default'}
            onClick={() => {
              setBucket(item.key);
              setPage(1);
            }}
          >
            {total == null ? item.label : `${item.label} ${total}`}
          </Button>
        );
      })}
    </Space>
  );

  const TripCard = ({ row }) => (
    <Card
      hoverable
      styles={{ body: { padding: '16px' } }}
      style={{ height: '100%', borderRadius: '8px' }}
      onClick={() => openAppointment(row.appointment?.id)}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Typography.Text strong style={{ fontSize: '16px' }}>
          {row.patient?.full_name || '-'}
        </Typography.Text>
        <Typography.Text type="secondary">
          {formatAppointmentDateTime(row.appointment)}
        </Typography.Text>
        <Typography.Text type="secondary">
          {row.appointment?.appointment_type?.name || '-'}
          {row.appointment?.location_name ? ` · ${row.appointment.location_name}` : ''}
        </Typography.Text>
        <Typography.Text>
          {row.rideHome ? 'Round trip' : 'Single trip'}
        </Typography.Text>
        <div>Ride there: {rideCell(row.rideThere, '-')}</div>
        <div>Ride home: {rideCell(row.rideHome, 'No ride home')}</div>
        {rowActions(row)}
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
              {pills}
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
            <div style={{ marginTop: 16 }}>{pills}</div>
            <Space size="middle" wrap style={{ marginTop: '16px' }}>
              {filters}
            </Space>
          </>
        )}
      </div>

      {isMobile ? (
        appointmentRows.length > 0 ? (
          <Row gutter={[12, 12]}>
            {appointmentRows.map((row) => (
              <Col xs={24} sm={12} key={row.key}>
                <TripCard row={row} />
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
            dataSource={appointmentRows}
            loading={loading}
            onRow={(record) => ({
              onClick: () => openAppointment(record.appointment?.id),
            })}
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

      {cancelChoiceTargets && (
        <CancelChoiceModal
          appointmentCount={uniqueAppointmentIds(cancelChoiceTargets).length}
          canCancelRide={cancelChoiceTargets.some((trip) => !isTerminalTrip(trip))}
          canCancelAppointment={cancelChoiceTargets.some(
            (trip) => !isCancelledAppointment(trip)
          )}
          confirmLoading={cancelLoading}
          onClose={() => setCancelChoiceTargets(null)}
          onRideOnly={() =>
            handleCancelTrips(
              cancelChoiceTargets.filter((trip) => !isTerminalTrip(trip))
            )
          }
          onRideAndAppointment={() => {
            const rows = cancelChoiceTargets;
            setCancelChoiceTargets(null);
            openAppointmentCancel(rows);
          }}
        />
      )}

      <BookRideModal
        open={bookRideOpen}
        onClose={() => setBookRideOpen(false)}
        onBooked={() => {
          setBookRideOpen(false);
          fetchTrips();
        }}
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
          beforeCancel={(appointment) => {
            const row = appointmentRows.find((item) => item.appointment?.id === appointment?.id);
            const legs = row?.legs || [];
            openCancelChoice(
              legs.length ? legs : [{ appointment, status: '' }]
            );
          }}
        />
      )}
    </Layout>
  );
};

export default TransportPage;
