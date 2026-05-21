import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';
import { MdAssignmentTurnedIn, MdShowChart } from 'react-icons/md';


const ClinicStats = ({ title }) => {

  const { patients_enrolled, open_conversations, bookings, declines, already_screened, loading } = useSelector(
    makeSelectClinicStatsData
  );
  return (
    <div className="mb-4">
      {loading && (
        <GroupRow>
          <OverviewCard
            span={4}
            title={"Patient Invited"}
            // tooltip={"Patient Invited"}
            content={`${parseInt(patients_enrolled ?? 0, 10)}`}
            styleTitle={title}
            icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={4}
            title={"Patients Engaged"}
            // tooltip={"Patients Engaged"}
            content={`${parseInt(open_conversations ?? 0, 10)}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={4}
            title={"Bookings"}
            // tooltip={"Bookings"}
            content={`${parseInt(bookings ?? 0, 10)}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={4}
            title={"Declines"}
            // tooltip={"Declines"}
            content={`${parseInt(declines ?? 0, 10)}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
            noTooltip
          />
          <OverviewCard
            span={4}
            title={" Screened elsewhere"}
            // tooltip={" Screened elsewhere"}
            content={`${parseInt(already_screened ?? 0, 10)}`}
            styleTitle={title}
            icon={<MdShowChart color="#ffffff" size="40" />}
            noTooltip
          />
        </GroupRow>
      )}
    </div>
  );
};

export default ClinicStats;
