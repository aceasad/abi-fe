import { Card, Table, Typography, Grid } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectScheduledAppointments } from 'redux/selectors/Patient';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { SCHEDULED_APPOINTMENT } from 'constants/ClinicConstants';
import { formatDateByCountry, removeLeadingZeroFromTime } from 'utils/helpers';
import dayjs from 'utils/dayjs';
import utils from 'utils';
import { formatPlace, rideStatusLabel, rideTypeLabel, tripTypeLabel } from '../AppointmentsPage/AppointmentTransportDetails';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const PatientOverviewTransportCard = ({ showAppointment }) => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const clinic = useSelector(makeSelectClinic());
  const { items, loading } = useSelector(makeSelectScheduledAppointments());

  const rides = (items || []).flatMap((appointment) =>
    (appointment.trips || []).map((trip) => ({
      ...trip,
      key: trip.id || `${appointment.id}-${trip.leg_role}`,
      appointment,
    }))
  );

  const columns = [
    {
      title: 'Date & time',
      key: 'datetime',
      render: (_, record) => {
        const date = formatDateByCountry(record.appointment?.date, clinic?.country, [
          'DD/MM/YYYY',
          'MM/DD/YYYY',
          'YYYY-MM-DD',
        ]);
        const time = record.appointment?.time
          ? removeLeadingZeroFromTime(
              dayjs(record.appointment.time, ['HH:mm', 'h:mm A']).format('hh:mm A')
            )
          : '';
        return [date, time].filter(Boolean).join(' ');
      },
    },
    {
      title: 'Type',
      dataIndex: ['appointment', 'appointment_type', 'name'],
      responsive: ['lg'],
    },
    {
      title: 'Ride type',
      key: 'rideType',
      render: (_, record) => rideTypeLabel(record),
    },
    {
      title: 'Trip Type',
      key: 'tripType',
      render: (_, record) => tripTypeLabel(record.appointment?.trips),
    },
    {
      title: 'Ride Status',
      dataIndex: 'status',
      render: (status) => rideStatusLabel(status),
    },
    {
      title: 'Pickup',
      dataIndex: 'pickup_place',
      render: (place) => formatPlace(place),
    },
    {
      title: 'Dropoff',
      dataIndex: 'dropoff_place',
      render: (place) => formatPlace(place),
    },
  ];

  return (
    <Card className="mt-3">
      <Title level={4} className="mb-3" style={{ fontSize: isMobile ? '16px' : '20px' }}>
        Transport
      </Title>
      <div className="table-responsive ant-table-row-pointer">
        <Table
          onRow={(record) => ({
            onClick: () =>
              showAppointment({
                id: record.appointment.id,
                type: SCHEDULED_APPOINTMENT,
              }),
          })}
          columns={columns}
          dataSource={rides}
          loading={loading}
          pagination={false}
        />
      </div>
    </Card>
  );
};

export default PatientOverviewTransportCard;
