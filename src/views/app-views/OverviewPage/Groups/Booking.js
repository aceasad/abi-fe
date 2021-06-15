import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { makeSelectBookingData } from 'redux/selectors/Overview';
import messages from '../messages';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';

const Booking = () => {
  const { formatMessage } = useIntl();

  const { bookingMadeAfterInvite, invitationRate, loading } = useSelector(
    makeSelectBookingData
  );

  return (
    <div className="mb-4">
      {!loading && (
        <GroupRow>
          <OverviewCard
            span={12}
            title={formatMessage(messages.bookingAfterInvite)}
            tooltip={formatMessage(messages.bookingAfterInviteTooltip)}
            content={bookingMadeAfterInvite}
          />
          <OverviewCard
            span={12}
            title={formatMessage(messages.bookingInvitation)}
            tooltip={formatMessage(messages.bookingInvitationTooltip)}
            content={`${invitationRate}%`}
          />
        </GroupRow>
      )}
    </div>
  );
};

export default Booking;
