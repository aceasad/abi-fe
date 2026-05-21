import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectBookingData } from 'redux/selectors/Overview';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';
import { MdAssignmentTurnedIn, MdShowChart } from 'react-icons/md';

const Booking = ({ title }) => {

  const { bookingMadeAfterInvite, invitationRate, loading } = useSelector(
    makeSelectBookingData
  );

  return (
    <div className="mb-4">
      {!loading && (
        <GroupRow>
          <OverviewCard
            span={12}
            title={"Bookings made after sending invite"}
            tooltip={"Bookings made after sending invite"}
            content={bookingMadeAfterInvite}
            styleTitle={title}
            icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={12}
            title={"Invitation rate"}
            tooltip={"Invitation rate"}
            content={`${invitationRate}%`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
        </GroupRow>
      )}
    </div>
  );
};

export default Booking;
