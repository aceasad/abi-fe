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

  const { patients_enrolled, open_conversations, bookings, declines, already_screened, loading } = useSelector(
    makeSelectClinicStatsData
  );
  return (
    <div className="mb-4">
      {loading && (
        <GroupRow>
          <OverviewCard
            span={4}
            title={formatMessage(messages.clinicStatsPatientEnrolled)}
            tooltip={formatMessage(messages.clinicStatsPatientEnrolled)}
            content={`${patients_enrolled ?? 0}`}
            styleTitle={title}
            icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={4}
            title={formatMessage(messages.clinicStatsOpenConversation)}
            tooltip={formatMessage(messages.clinicStatsOpenConversation)}
            content={`${open_conversations ?? 0}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
          <OverviewCard
            span={4}
            title={formatMessage(messages.clinicStatsBookings)}
            tooltip={formatMessage(messages.clinicStatsBookings)}
            content={`${bookings ?? 0}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
          <OverviewCard
            span={4}
            title={formatMessage(messages.clinicStatsDecline)}
            tooltip={formatMessage(messages.clinicStatsDecline)}
            content={`${declines ?? 0}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
          <OverviewCard
            span={4}
            title={formatMessage(messages.clinicStatsAlreadyScreened)}
            tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
            content={`${already_screened ?? 0}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
          />
        </GroupRow>
      )}
    </div>
  );
};

export default ClinicStats;
