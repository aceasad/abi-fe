import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';
import { MdAssignmentTurnedIn, MdShowChart } from 'react-icons/md';

const dummyData = {
  tooltip: 'About this card.',
  invite: '32',
  invitation: '34%',
};

const Booking = ({ title }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.bookingAfterInvite)}
          tooltip={dummyData.tooltip}
          content={dummyData.invite}
          styleTitle={title}
          icon={<MdAssignmentTurnedIn color="#ffffff" size="20" />}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.bookingInvitation)}
          tooltip={dummyData.tooltip}
          content={dummyData.invitation}
          styleTitle={title}
          icon={<MdShowChart color="#ffffff" size="20" />}
        />
      </GroupRow>
    </div>
  );
};

export default Booking;
