import { Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from '../messages';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';

const { Title } = Typography;

const dummyData = {
  tooltip: 'About this card.',
  invite: '32',
  efficiency: '5x',
  invitation: '34%',
};

const Booking = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <Title level={4} className="text-primary mb-3">
        {formatMessage(messages.bookingTitle)}
      </Title>
      <GroupRow>
        <OverviewCard
          span={8}
          title={formatMessage(messages.bookingAfterInvite)}
          tooltip={dummyData.tooltip}
          content={dummyData.invite}
        />
        <OverviewCard
          span={8}
          title={formatMessage(messages.bookingEfficiency)}
          tooltip={dummyData.tooltip}
          content={dummyData.efficiency}
        />
        <OverviewCard
          span={8}
          title={formatMessage(messages.bookingInvitation)}
          tooltip={dummyData.tooltip}
          content={dummyData.invitation}
        />
      </GroupRow>
    </div>
  );
};

export default Booking;
