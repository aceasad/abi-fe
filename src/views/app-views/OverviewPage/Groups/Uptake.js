import React from 'react';
import OverviewCard from '../OverviewCard';
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
          title={"Uptake"}
          tooltip={"Uptake"}
          content={`${uptake}%`}
          styleTitle={title}
          icon={<MdSystemUpdateAlt color="#ffffff" size="40" />}
        />
        <OverviewCard
          span={12}
          title={"Uptake - country average"}
          tooltip={"Uptake - country average"}
          content={`${uptakeAverage}%`}
          styleTitle={title}
          icon={<MdInsertChart color="#ffffff" size="40" />}
        />
        <OverviewCard
          span={12}
          title={"Coverage"}
          tooltip={"Coverage"}
          content={`${coverage}%`}
          styleTitle={title}
          icon={<MdLooks color="#ffffff" size="40" />}
        />
        <OverviewCard
          span={12}
          title={"Coverage - country average"}
          tooltip={"Coverage - country average"}
          content={`${coverageAverage}%`}
          styleTitle={title}
          icon={<MdInsertChart color="#ffffff" size="40" />}
        />
      </GroupRow>
    </div>
  );
};

export default Uptake;
