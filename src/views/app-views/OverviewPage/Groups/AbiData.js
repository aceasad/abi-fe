import React from 'react';
import OverviewCard from '../OverviewCard';
import GroupRow from './GroupRow';
import { useSelector } from 'react-redux';
import { makeSelectAsaData } from 'redux/selectors/Overview';
import { MdLoop, MdAttachMoney } from 'react-icons/md';
import Pound from '../../../../components/icons/Pound.js';

const AbiData = ({ title }) => {
  const { asaEfficiency, revenueSaved, loading } = useSelector(
    makeSelectAsaData
  );

  return (
    <div className="mb-4">
      {!loading && (
        <GroupRow>
          <OverviewCard
            span={12}
            title={"Asa efficiency"}
            tooltip={"ASA efficiency"}
            content={`${asaEfficiency}x`}
            styleTitle={title}
            icon={<MdLoop color="#ffffff" size="40" />}
          />
          <OverviewCard
            span={12}
            title={"Revenue saved due to Asa"}
            tooltip={"Revenue saved due to ASA"}
            content={`£${revenueSaved.toLocaleString('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}`}
            styleTitle={title}
            icon={<Pound color="#ffffff" size="40" />}
            responsiveScore
          />
        </GroupRow>
      )}
    </div>
  );
};

export default AbiData;
