import { Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';

const { Title } = Typography;

const dummyData = {
  efficiency: '5x',
  saved: '£21,291.99',
  tooltip: 'About this card.',
};

const AbiData = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <Title level={4} className="text-primary mb-3">
        {formatMessage(messages.asaDataTitle)}
      </Title>
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.asaDataEfficiency)}
          tooltip={dummyData.tooltip}
          content={dummyData.efficiency}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.asaDataRevenueSaved)}
          tooltip={dummyData.tooltip}
          content={dummyData.saved}
        />
      </GroupRow>
    </div>
  );
};

export default AbiData;
