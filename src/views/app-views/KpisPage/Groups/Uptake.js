import React from 'react';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';
import { useSelector } from 'react-redux';
import { makeSelectUptakeData } from 'redux/selectors/Overview';
import { MdSystemUpdateAlt, MdInsertChart, MdLooks } from 'react-icons/md';

const Uptake = ({ title }) => {

  const { coverage, uptake, coverageAverage, uptakeAverage } = useSelector(
    makeSelectUptakeData
  );

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={messages.uptakeProportion}
          tooltip={messages.uptakeProportionTooltip}
          content={`${uptake}%`}
          styleTitle={title}
          icon={<MdSystemUpdateAlt color="#ffffff" size="40" />}
        />
        <OverviewCard
          span={12}
          title={messages.uptakeAverage}
          tooltip={messages.uptakeAverageTooltip}
          content={`${uptakeAverage}%`}
          styleTitle={title}
          icon={<MdInsertChart color="#ffffff" size="40" />}
        />
        <OverviewCard
          span={12}
          title={messages.uptakeCoverageProportion}
          tooltip={messages.uptakeCoverageProportionTooltip}
          content={`${coverage}%`}
          styleTitle={title}
          icon={<MdLooks color="#ffffff" size="40" />}
        />
        <OverviewCard
          span={12}
          title={messages.uptakeCoverageAverage}
          tooltip={messages.uptakeCoverageAverageTooltip}
          content={`${coverageAverage}%`}
          styleTitle={title}
          icon={<MdInsertChart color="#ffffff" size="40" />}
        />
      </GroupRow>
    </div>
  );
};

export default Uptake;
