import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';
import { MdSystemUpdateAlt, MdInsertChart, MdLooks } from 'react-icons/md';

const dummyData = {
  tooltip: 'About this card.',
  proportion: '75%',
  average: '70%',
  coverage: '75%',
  coverageProp: '73.5%',
};

const Uptake = ({ title }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeProportion)}
          tooltip={dummyData.tooltip}
          content={dummyData.proportion}
          styleTitle={title}
          icon={<MdSystemUpdateAlt color="#ffffff" size="20" />}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeAverage)}
          tooltip={dummyData.tooltip}
          content={dummyData.average}
          styleTitle={title}
          icon={<MdInsertChart color="#ffffff" size="20" />}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeCoverageProportion)}
          tooltip={dummyData.tooltip}
          content={dummyData.coverage}
          styleTitle={title}
          icon={<MdLooks color="#ffffff" size="20" />}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeCoverageAverage)}
          tooltip={dummyData.tooltip}
          content={dummyData.coverageProp}
          styleTitle={title}
          icon={<MdInsertChart color="#ffffff" size="20" />}
        />
      </GroupRow>
    </div>
  );
};

export default Uptake;
