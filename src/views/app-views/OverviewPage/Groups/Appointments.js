import { Row } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import AppointmentsCharts from './AppointemnsCharts';
import GroupRow from './GroupRow';
import { MdAssignmentLate, MdMoneyOff } from 'react-icons/md';

const dummyData = {
  missed: '30/200',
  cost: '£8,323.92',
  tooltip: 'About this card.',
};

const Appointments = ({ title }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <GroupRow appointments>
        <Row gutter={16}>
          <OverviewCard
            span={12}
            title={formatMessage(messages.appointmentsMissed)}
            tooltip={dummyData.tooltip}
            content={dummyData.missed}
            styleTitle={title}
            icon={<MdAssignmentLate color="#ffffff" size="20" />}
          />
          <OverviewCard
            span={12}
            title={formatMessage(messages.appointmentsCostOfMissed)}
            tooltip={dummyData.tooltip}
            content={dummyData.cost}
            styleTitle={title}
            icon={<MdMoneyOff color="#ffffff" size="20" />}
          />
        </Row>
        <AppointmentsCharts />
      </GroupRow>
    </div>
  );
};

export default Appointments;
