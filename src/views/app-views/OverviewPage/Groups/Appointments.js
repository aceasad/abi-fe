import { Row } from 'antd';
import React from 'react';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import AppointmentsCharts from './AppointemnsCharts';
import GroupRow from './GroupRow';
import { useSelector } from 'react-redux';
import { makeSelectAppointmentData } from 'redux/selectors/Overview';
import { MdAssignmentLate, MdMoneyOff } from 'react-icons/md';
import PoundCrossedOut from '../../../../components/icons/PoundCrossedOut.js';

const Appointments = ({ title }) => {
  const {
    missedAppointmentsScreening,
    costOfMissedAppointments,
    loading,
  } = useSelector(makeSelectAppointmentData);
  return (
    <div className="mb-4">
      {!loading && (
        <GroupRow appointments>
          <Row gutter={16}>
            <OverviewCard
              span={12}
              title={messages.appointmentsMissed}
              tooltip={messages.appointmentsMissedTooltip}
              content={missedAppointmentsScreening}
              styleTitle={title}
              icon={<MdAssignmentLate color="#ffffff" size="40" />}
              noTooltip
            />
            <OverviewCard
              span={12}
              title={messages.appointmentsCostOfMissed}
              tooltip={messages.appointmentsCostOfMissedTooltip}
              content={`£${costOfMissedAppointments.toLocaleString('en-US', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })}`}
              styleTitle={title}
              icon={<PoundCrossedOut color="#ffffff" size="40" />}
              noTooltip
            />
          </Row>
          <AppointmentsCharts />
        </GroupRow>
      )}
    </div>
  );
};

export default Appointments;
