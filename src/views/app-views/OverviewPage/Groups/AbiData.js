import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';
import { MdLoop, MdAttachMoney } from 'react-icons/md';

const dummyData = {
  efficiency: '5x',
  saved: '£21,291.99',
  tooltip: 'About this card.',
};

const AbiData = ({ title }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.asaDataEfficiency)}
          tooltip={dummyData.tooltip}
          content={dummyData.efficiency}
          styleTitle={title}
          icon={<MdLoop color="#ffffff" size="20" />}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.asaDataRevenueSaved)}
          tooltip={dummyData.tooltip}
          content={dummyData.saved}
          styleTitle={title}
          icon={<MdAttachMoney color="#ffffff" size="20" />}
        />
      </GroupRow>
    </div>
  );
};

export default AbiData;
