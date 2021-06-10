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
  invitation: '34%',
};

const Booking = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.bookingAfterInvite)}
          tooltip={dummyData.tooltip}
          content={dummyData.invite}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.bookingInvitation)}
          tooltip={dummyData.tooltip}
          content={dummyData.invitation}
        />
      </GroupRow>
    </div>
  );
};

export default Booking;
