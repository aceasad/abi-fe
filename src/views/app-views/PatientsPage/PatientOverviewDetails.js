import { Divider } from 'antd';
import React from 'react';
import PatientInfoListItem from './PatientInfoListItem';

const PatientOverviewDetails = ({ fields, patient }) => {
  const firstDivider = 4;
  const secondDivider = 10;

  const hasDivider = (index) =>
    index === firstDivider || index === secondDivider;

  return (
    <>
      {fields.map((field, index) => {
        if (hasDivider(index)) {
          return (
            <div key={index}>
              <PatientInfoListItem>
                {field}
                {patient[field]}
              </PatientInfoListItem>
              <Divider className="mt-2 mb-2" />
            </div>
          );
        }
        return (
          <PatientInfoListItem key={index}>
            {field}
            {patient[field]}
          </PatientInfoListItem>
        );
      })}
    </>
  );
};

export default PatientOverviewDetails;
