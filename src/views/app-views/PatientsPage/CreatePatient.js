import React from 'react';
import localeString from 'utils/localeString';
import PatientForm from './PatientForm';

const CreatePatient = ({ localization = true }) => (
  <PatientForm
    localization={localization}
    title={localeString(localization, 'patient_details.header.title.new')}
  />
);

export default CreatePatient;
