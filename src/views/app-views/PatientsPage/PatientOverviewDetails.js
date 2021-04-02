import { Divider } from 'antd';
import React from 'react';
import PatientInfoListItem from './PatientInfoListItem';

const PatientOverviewDetails = ({ fields, patient }) => {
  return (
    <>
      {fields.map((field, index) => {
        if (index === 4 || index === 10) {
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
