import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import messages from '../messages';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';
import { MdAssignmentTurnedIn, MdShowChart } from 'react-icons/md';


const ClinicStats = ({ title }) => {
  const { formatMessage } = useIntl();

  const { patients_enrolled, open_conversations, bookings, declines, already_screened, patients_engaged_after_invite } = useSelector(
    makeSelectClinicStatsData
  );
  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={4}
          title={formatMessage(messages.clinicStatsPatientEnrolled)}
          // tooltip={formatMessage(messages.clinicStatsPatientEnrolled)}
          content={`${parseInt((patients_enrolled) ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={4}
          title={formatMessage(messages.clinicStatsInvitationRate)}
          content={`${parseInt((patients_engaged_after_invite) ?? 0, 10)}%`}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={4}
          title={formatMessage(messages.clinicStatsOpenConversation)}
          // tooltip={formatMessage(messages.clinicStatsOpenConversation)}
          content={`${parseInt(open_conversations ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={4}
          title={formatMessage(messages.clinicStatsBookings)}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(bookings ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />

      </GroupRow>
      <GroupRow>
        <OverviewCard
          span={4}
          title={formatMessage(messages.clinicStatsDecline)}
          // tooltip={formatMessage(messages.clinicStatsDecline)}
          content={`${parseInt(declines ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={4}
          title={formatMessage(messages.clinicStatsAlreadyScreened)}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(already_screened ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
      </GroupRow>
    </div>
  );
};

export default ClinicStats;
