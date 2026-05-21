import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectBookingData } from 'redux/selectors/Overview';
import messages from '../messages';
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
            title={messages.bookingAfterInvite}
            tooltip={messages.bookingAfterInviteTooltip}
            content={bookingMadeAfterInvite}
            styleTitle={title}
            icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={12}
            title={messages.bookingInvitation}
            tooltip={messages.bookingInvitationTooltip}
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
