import { Divider } from 'antd';
import React from 'react';
import PatientInfoListItem from './PatientInfoListItem';

const PatientOverviewDetails = ({ fields, patient }) => {
  const firstDivider = 4;
  const secondDivider = 11;

  const hasDivider = (index) =>
    index === firstDivider || index === secondDivider;

  return (
    <>
      {Object.keys(fields).map((field, index) => (
        <div key={index}>
          <PatientInfoListItem className={!patient[field] ? 'd-none' : ''}>
            {fields[field]}
            {patient[field]}
          </PatientInfoListItem>
          {hasDivider(index) && <Divider className="mt-2 mb-3" />}
        </div>
      ))}
    </>
  );
};

export default PatientOverviewDetails;
