import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { makeSelectBookingData } from 'redux/selectors/Overview';
import messages from '../messages';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';
import { MdAssignmentTurnedIn, MdShowChart } from 'react-icons/md';

const ClinicStats = ({ title }) => {
  const { formatMessage } = useIntl();

  // const { bookingMadeAfterInvite, invitationRate, loading } = useSelector(
  //   makeSelectBookingData
  // );

  return (
    <div className="mb-4">
      {/* {!loading && ( */}
        <GroupRow>
          <OverviewCard
            span={12}
            title={formatMessage(messages.clinicStatsPatientEnrolled)}
            tooltip={formatMessage(messages.clinicStatsPatientEnrolled)}
            content={100}
            styleTitle={title}
            icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={12}
            title={formatMessage(messages.clinicStatsOpenConversation)}
            tooltip={formatMessage(messages.clinicStatsOpenConversation)}
            content={`${200}%`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
          <OverviewCard
            span={12}
            title={formatMessage(messages.clinicStatsBookings)}
            tooltip={formatMessage(messages.clinicStatsBookings)}
            content={`${200}%`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
          <OverviewCard
            span={12}
            title={formatMessage(messages.clinicStatsDecline)}
            tooltip={formatMessage(messages.clinicStatsDecline)}
            content={`${200}%`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
        </GroupRow>
      {/* )} */}
    </div>
  );
};

export default ClinicStats;
