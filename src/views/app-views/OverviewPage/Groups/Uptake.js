import { Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';

const { Title } = Typography;

const dummyData = {
  tooltip: 'About this card.',
  proportion: '75%',
  average: '70%',
  coverage: '75%',
  coverageProp: '73.5%',
};

const Uptake = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeProportion)}
          tooltip={dummyData.tooltip}
          content={dummyData.proportion}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeAverage)}
          tooltip={dummyData.tooltip}
          content={dummyData.average}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeCoverageProportion)}
          tooltip={dummyData.tooltip}
          content={dummyData.coverage}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeCoverageAverage)}
          tooltip={dummyData.tooltip}
          content={dummyData.coverageProp}
        />
      </GroupRow>
    </div>
  );
};

export default Uptake;
