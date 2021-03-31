import React from 'react';
import localeString from 'utils/localeString';
import PatientForm from './PatientForm';

const UpdatePatient = ({ localization = true }) => (
  <PatientForm
    localization={localization}
    title={localeString(localization, 'patient_details.header.title.edit')}
  />
);

export default UpdatePatient;
