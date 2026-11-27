import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Grid, Pagination, Row, Space, Table, Tooltip, Typography, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import transportService from 'services/TransportService';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { SCHEDULED_APPOINTMENT } from 'constants/ClinicConstants';
import { formatDateByCountry, removeLeadingZeroFromTime } from 'utils/helpers';
import dayjs from 'utils/dayjs';
import utils from 'utils';
import { useSelector } from 'react-redux';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { rideStatusLabel } from '../AppointmentsPage/AppointmentTransportDetails';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const DATE_INPUT_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

const TERMINAL_TRIP_STATUSES = new Set([
  'cancelled',
  'canceled',
  'completed',
  'performed',
  'tp declined',
]);

const isTerminalTrip = (trip) =>
  TERMINAL_TRIP_STATUSES.has(String(trip?.status || '').toLowerCase());

const canActivateReturn = (trip) =>
  trip?.leg_role === 'return' &&
  trip?.pickup_type === 'will_call' &&
  !trip?.activated_at &&
  !isTerminalTrip(trip);

const TRAILING_OFFSET_PATTERN = /([+-]\d{2}:?\d{2}|Z)$/;

const inPickupZone = (value, pickupTimezone) => {
  if (!value) return null;
  if (pickupTimezone) {
    try {
      const zoned = dayjs(value).tz(pickupTimezone);
      if (zoned.isValid()) return zoned;
    } catch {
      // Unknown zone names throw; fall through to the offset on the timestamp.
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

const PatientOverviewTransportCard = ({ patient, showAppointment }) => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const clinic = useSelector(makeSelectClinic());

  const [trips, setTrips] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_LIMIT);
  const [activatingTripId, setActivatingTripId] = useState(null);

  const fetchTrips = useCallback(async () => {
    if (!patient?.id) return;
    setLoading(true);
    try {
      const response = await transportService.getStaffTrips({
        patient_id: patient.id,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
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
  }, [patient?.id, page, pageSize]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const appointmentRows = useMemo(() => {
    const grouped = new Map();
    trips.forEach((trip) => {
      const appointmentId = trip.appointment?.id;
      if (!grouped.has(appointmentId)) {
        grouped.set(appointmentId, {
          key: appointmentId,
          appointment: trip.appointment,
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

  const formatAppointmentDateTime = (appointment) => {
    const date = formatDateByCountry(appointment?.date, clinic?.country, DATE_INPUT_FORMATS);
    const time = appointment?.time
      ? removeLeadingZeroFromTime(dayjs(appointment.time, ['HH:mm', 'h:mm A']).format('hh:mm A'))
      : '';
    return [date, time].filter(Boolean).join(' ');
  };

  const openAppointment = (appointmentId) => {
    if (!appointmentId) return;
    showAppointment({ id: appointmentId, type: SCHEDULED_APPOINTMENT });
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
      return <Text type="secondary">{emptyLabel}</Text>;
    }
    const timing = rideTimingLabel(trip);
    return (
      <Space align="start" onClick={(event) => event.stopPropagation()}>
        <div>
          <div>{rideStatusLabel(trip.status, trip)}</div>
          {timing && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {timing}
            </Text>
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
      title: 'Appointment',
      key: 'appointment',
      render: (_, record) => (
        <div>
          <div>{formatAppointmentDateTime(record.appointment) || '-'}</div>
          <Text type="secondary">{record.appointment?.appointment_type?.name || '-'}</Text>
          {record.appointment?.location_name && (
            <div>
              <Text type="secondary">{record.appointment.location_name}</Text>
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

  const pagination = {
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
  };

  const TripCard = ({ row }) => (
    <Card
      hoverable
      styles={{ body: { padding: '16px' } }}
      style={{ height: '100%', borderRadius: '8px' }}
      onClick={() => openAppointment(row.appointment?.id)}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text type="secondary">{formatAppointmentDateTime(row.appointment)}</Text>
        <Text type="secondary">
          {row.appointment?.appointment_type?.name || '-'}
          {row.appointment?.location_name ? ` · ${row.appointment.location_name}` : ''}
        </Text>
        <Text>{row.rideHome ? 'Round trip' : 'Single trip'}</Text>
        <div>Ride there: {rideCell(row.rideThere, '-')}</div>
        <div>Ride home: {rideCell(row.rideHome, 'No ride home')}</div>
        {rowActions(row)}
      </Space>
    </Card>
  );

  return (
    <Card className="mt-3">
      <Title level={4} className="mb-3" style={{ fontSize: isMobile ? '16px' : '20px' }}>
        Transport
      </Title>
      {isMobile ? (
        <>
          {loading ? (
            <Card loading />
          ) : appointmentRows.length > 0 ? (
            <Row gutter={[12, 12]}>
              {appointmentRows.map((row) => (
                <Col xs={24} key={row.key}>
                  <TripCard row={row} />
                </Col>
              ))}
            </Row>
          ) : (
            <Text type="secondary">No transport trips available</Text>
          )}
          {count > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Pagination {...pagination} />
            </div>
          )}
        </>
      ) : (
        <div className="table-responsive ant-table-row-pointer">
          <Table
            columns={columns}
            dataSource={appointmentRows}
            loading={loading}
            onRow={(record) => ({
              onClick: () => openAppointment(record.appointment?.id),
            })}
            pagination={pagination}
          />
        </div>
      )}
    </Card>
  );
};

export default PatientOverviewTransportCard;
