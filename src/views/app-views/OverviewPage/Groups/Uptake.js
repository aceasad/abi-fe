import React from 'react';
import { useIntl } from 'react-intl';
import OverviewCard from '../OverviewCard';
import messages from '../messages';
import GroupRow from './GroupRow';
import { useSelector } from 'react-redux';
import { makeSelectUptakeData } from 'redux/selectors/Overview';

const Uptake = () => {
  const { formatMessage } = useIntl();

  const { coverage, uptake, coverageAverage, uptakeAverage } = useSelector(
    makeSelectUptakeData
  );

  return (
    <div className="mb-4">
      <GroupRow>
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeProportion)}
          tooltip={formatMessage(messages.uptakeProportionTooltip)}
          content={`${uptake}%`}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeAverage)}
          tooltip={formatMessage(messages.uptakeAverageTooltip)}
          content={`${uptakeAverage}%`}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeCoverageProportion)}
          tooltip={formatMessage(messages.uptakeCoverageProportionTooltip)}
          content={`${coverage}%`}
        />
        <OverviewCard
          span={12}
          title={formatMessage(messages.uptakeCoverageAverage)}
          tooltip={formatMessage(messages.uptakeCoverageAverageTooltip)}
          content={`${coverageAverage}%`}
        />
      </GroupRow>
    </div>
  );
};

export default Uptake;
