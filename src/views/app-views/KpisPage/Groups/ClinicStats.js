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

  const { patients_enrolled, open_conversations, bookings, declines, already_screened, patients_engaged_after_invite, not_on_whatsapp, snooze } = useSelector(
    makeSelectClinicStatsData
  );
  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsPatientEnrolled)}
          // tooltip={formatMessage(messages.clinicStatsPatientEnrolled)}
          content={`${parseInt((patients_enrolled) ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsInvitesRecieved)}
          content={`${parseInt((patients_enrolled - not_on_whatsapp) ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsOpenConversation)}
          // tooltip={formatMessage(messages.clinicStatsOpenConversation)}
          content={`${parseInt(patients_engaged_after_invite ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clnincStatsInvitationRate)}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt((((patients_enrolled - not_on_whatsapp) / patients_engaged_after_invite) * 100) ?? 0, 10)}%`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />

      </GroupRow>
      <GroupRow>
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsBookings)}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(bookings ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />

        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsDecline)}
          // tooltip={formatMessage(messages.clinicStatsDecline)}
          content={`${parseInt(declines ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsAlreadyScreened)}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(already_screened ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />

        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsSnoozed)}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(snooze ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
      </GroupRow>
    </div>
  );
};

export default ClinicStats;
