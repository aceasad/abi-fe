import { Empty, Typography } from 'antd';
import React from 'react';
import RowWithMultipleColumns from 'components/util-components/Grid/RowWithMultipleColumns';

const { Paragraph } = Typography;

const formatPlace = (place) => {
  if (!place || typeof place !== 'object') return '';
  return [place.line_1, place.city, place.state, place.zip]
    .filter(Boolean)
    .join(', ');
};

const legLabel = (legRole) => {
  if (legRole === 'outbound') return 'To clinic';
  if (legRole === 'return') return 'Return';
  return legRole || '';
};

const rideStatusLabel = (status) => {
  if (!status) return 'Scheduled';
  return String(status)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const rideTypeLabel = (trip) => trip?.service_type || '';

const tripTypeLabel = (trips) =>
  (trips || []).some((trip) => trip.leg_role === 'return') ? 'Round-trip' : 'Single-trip';

const AppointmentTransportDetails = ({ trips, title = 'Transport' }) => {
  if (!trips?.length) {
    return (
      <div>
        <Paragraph strong type="secondary" className="mb-2">
          {title}
        </Paragraph>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div>
      <Paragraph strong type="secondary" className="mb-2">
        {title}
      </Paragraph>
      <RowWithMultipleColumns className="mb-2" gutter={16} spanList={[8, 16]}>
        Trip Type:
        {tripTypeLabel(trips)}
      </RowWithMultipleColumns>
      {trips.map((trip) => (
        <div key={trip.id || trip.tms_trip_id} className="mb-3">
          {rideTypeLabel(trip) && (
            <RowWithMultipleColumns className="mb-2" gutter={16} spanList={[8, 16]}>
              Ride type:
              {rideTypeLabel(trip)}
            </RowWithMultipleColumns>
          )}
          <RowWithMultipleColumns className="mb-2" gutter={16} spanList={[8, 16]}>
            Ride Status:
            {rideStatusLabel(trip.status)}
          </RowWithMultipleColumns>
          {formatPlace(trip.pickup_place) && (
            <RowWithMultipleColumns className="mb-2" gutter={16} spanList={[8, 16]}>
              Pickup:
              {formatPlace(trip.pickup_place)}
            </RowWithMultipleColumns>
          )}
          {formatPlace(trip.dropoff_place) && (
            <RowWithMultipleColumns className="mb-2" gutter={16} spanList={[8, 16]}>
              Dropoff:
              {formatPlace(trip.dropoff_place)}
            </RowWithMultipleColumns>
          )}
          {trip.tms_trip_id && (
            <RowWithMultipleColumns className="mb-2" gutter={16} spanList={[8, 16]}>
              Trip ID:
              {trip.tms_trip_id}
            </RowWithMultipleColumns>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentTransportDetails;
export { formatPlace, legLabel, rideStatusLabel, rideTypeLabel, tripTypeLabel };
