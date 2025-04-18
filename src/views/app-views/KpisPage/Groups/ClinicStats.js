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

  const { engagement_rate, booking_rate, total_patients_added, total_patients_invited, total_patients_failed_message_status, total_patients_sent_message_status,
    total_patients_engaged, total_patients_read_but_no_response, open_conversations, bookings,
    reschedule, cancelled, attended, non_attended, booking_time_distribution,
    declines, opt_out, snoozed, emergency_situation, human_intervention, already_screened } = useSelector(
      makeSelectClinicStatsData
    );
  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsPatientEnrolled)}
          // tooltip={formatMessage(messages.clinicStatsPatientEnrolled)}
          content={`${parseInt((total_patients_added) ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsInvitesRecieved)}
          content={`${parseInt((total_patients_invited) ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsOpenConversation)}
          // tooltip={formatMessage(messages.clinicStatsOpenConversation)}
          content={`${parseInt(total_patients_engaged ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={formatMessage(messages.clnincStatsInvitationRate)}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(((engagement_rate)) ?? 0, 10)}%`}
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
          title={"Booking rate"}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(((booking_rate)) ?? 0, 10)}%`}
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
      </GroupRow>
      <GroupRow>
        <OverviewCard
          span={6}
          title={"Opt-out"}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(opt_out ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />


        <OverviewCard
          span={6}
          title={formatMessage(messages.clinicStatsSnoozed)}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(snoozed ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />

        <OverviewCard
          span={6}
          title={"Emergency situation"}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(emergency_situation ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />


        <OverviewCard
          span={6}
          title={"Human intervention needed"}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(human_intervention ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
      </GroupRow>
      <GroupRow>
        <OverviewCard
          span={6}
          title={"Attended"}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(attended ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={"Non attended"}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(non_attended ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={"Reschedules"}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(reschedule ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={"Cancelled"}
          // tooltip={formatMessage(messages.clinicStatsBookings)}
          content={`${parseInt(cancelled ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />

      </GroupRow>
      <GroupRow>
        <OverviewCard
          span={6}
          title={"Morning"}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(booking_time_distribution['morning'] ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={"Afternoon"}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(booking_time_distribution['afternoon'] ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={"Evening"}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(booking_time_distribution['evening'] ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
        <OverviewCard
          span={6}
          title={"Night"}
          // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
          content={`${parseInt(booking_time_distribution['night'] ?? 0, 10)}`}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="40" />}
          noTooltip
        />
      </GroupRow>

    </div>
  );
};

export default ClinicStats;
