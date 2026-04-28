import { Divider } from 'antd';
import React from 'react';
import PatientInfoListItem from './PatientInfoListItem';

const PatientOverviewDetails = ({ fields, patient }) => {
  const visibleFields = Object.keys(fields).filter((field) => !!patient[field]);
  const firstDivider = 4;
  const secondDivider = 11;

  const hasDivider = (index) => index === firstDivider || index === secondDivider;

  return (
    <>
      {visibleFields.map((field, index) => (
        <div key={index}>
          <PatientInfoListItem>
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
